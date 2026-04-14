"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// Minimal SpeechRecognition interfaces — not available in all TS DOM libs
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  start(): void;
  stop(): void;
}
interface ISpeechRecognitionConstructor {
  new (): ISpeechRecognition;
}

type RecorderState =
  | "idle"
  | "requesting"
  | "recording"
  | "preview"
  | "transcribing"
  | "permission-denied"
  | "not-supported";

interface Props {
  onTranscript: (text: string) => void;
}

// Detect the best supported MIME type for recording
function getSupportedMimeType(): string | null {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VoiceRecorder({ onTranscript }: Props) {
  const [recorderState, setRecorderState] = useState<RecorderState>(
    typeof window !== "undefined" && typeof MediaRecorder === "undefined"
      ? "not-supported"
      : "idle"
  );
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedVoice, setHasUsedVoice] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const rawTranscriptRef = useRef<string>("");
  const audioBlobRef = useRef<Blob | null>(null);
  const mimeTypeRef = useRef<string>("");

  // Cleanup on unmount or navigation away
  useEffect(() => {
    return () => {
      stopEverything();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Revoke object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const stopEverything = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    setError(null);
    rawTranscriptRef.current = "";
    chunksRef.current = [];

    // Check MediaRecorder support
    if (typeof MediaRecorder === "undefined") {
      setRecorderState("not-supported");
      return;
    }

    const mimeType = getSupportedMimeType();
    if (!mimeType) {
      setRecorderState("not-supported");
      return;
    }
    mimeTypeRef.current = mimeType;

    setRecorderState("requesting");

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const e = err as DOMException;
      if (e.name === "NotAllowedError" || e.name === "PermissionDeniedError") {
        setRecorderState("permission-denied");
      } else {
        setError("Could not access microphone: " + e.message);
        setRecorderState("idle");
      }
      return;
    }

    streamRef.current = stream;

    // Set up MediaRecorder
    const recorder = new MediaRecorder(stream, { mimeType });
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
      audioBlobRef.current = blob;
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setRecorderState("preview");
      // Stop stream tracks
      stream.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };

    recorder.start(100); // collect data every 100ms
    setRecorderState("recording");
    setDuration(0);
    setHasUsedVoice(true);

    // Live timer
    timerRef.current = setInterval(() => {
      setDuration((d) => d + 1);
    }, 1000);

    // Set up Web Speech API for real-time transcript
    const w = window as typeof window & {
      SpeechRecognition?: ISpeechRecognitionConstructor;
      webkitSpeechRecognition?: ISpeechRecognitionConstructor;
    };
    const SpeechRecognitionAPI = w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;

    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            rawTranscriptRef.current +=
              (rawTranscriptRef.current ? " " : "") +
              event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = () => {
        // Non-fatal — we'll still show the preview, transcript may be empty
      };

      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch {
        // SpeechRecognition failed to start — continue without it
      }
    }
  };

  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* ignore */ }
      recognitionRef.current = null;
    }
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      // onstop will fire → sets audioUrl + "preview" state
    }
  }, []);

  const reRecord = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    audioBlobRef.current = null;
    rawTranscriptRef.current = "";
    chunksRef.current = [];
    setDuration(0);
    setError(null);
    setRecorderState("idle");
  }, [audioUrl]);

  const useRecording = useCallback(async () => {
    const raw = rawTranscriptRef.current.trim();

    if (duration < 1) {
      setError("Recording is too short. Please record at least 1 second.");
      setRecorderState("preview");
      return;
    }

    setRecorderState("transcribing");

    // If we have no raw transcript (SpeechRecognition unavailable/failed),
    // we can't send anything to Claude — tell the user to type their answer.
    if (!raw) {
      setError(
        "Could not capture speech in your browser. The text box is ready for you to type your answer."
      );
      setRecorderState("preview");
      return;
    }

    try {
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawTranscript: raw }),
      });

      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();

      onTranscript(data.transcript);
      // Clean up
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
      audioBlobRef.current = null;
      rawTranscriptRef.current = "";
      setDuration(0);
      setRecorderState("idle");
    } catch {
      setError("Transcription failed. Please try again or type your answer.");
      setRecorderState("preview");
    }
  }, [duration, audioUrl, onTranscript]);

  // ── Render: not-supported ──────────────────────────────────────────────────
  if (recorderState === "not-supported") {
    return (
      <div
        className="px-4 py-3 text-xs leading-relaxed"
        style={{
          background: "var(--bg-surface)",
          border: "1.5px dashed var(--border)",
          color: "var(--muted)",
          fontFamily: "var(--font-space-mono)",
        }}
      >
        VOICE INPUT NOT SUPPORTED — Your browser does not support audio
        recording. Please type your answer below.
      </div>
    );
  }

  // ── Render: permission denied ──────────────────────────────────────────────
  if (recorderState === "permission-denied") {
    return (
      <div
        className="px-4 py-4 space-y-2"
        style={{
          background: "var(--bg-surface)",
          border: "1.5px dashed var(--border)",
        }}
      >
        <p
          className="text-xs tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--fg)" }}
        >
          MICROPHONE ACCESS DENIED
        </p>
        <p
          className="text-xs leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}
        >
          To enable voice input: click the lock icon in your browser&apos;s address
          bar → find Microphone → set it to Allow → refresh the page.
        </p>
        <button
          onClick={() => setRecorderState("idle")}
          className="text-xs tracking-[0.14em] uppercase underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          DISMISS
        </button>
      </div>
    );
  }

  // ── Render: transcribing ───────────────────────────────────────────────────
  if (recorderState === "transcribing") {
    return (
      <div
        className="flex items-center gap-3 px-4 py-4"
        style={{
          background: "var(--bg-surface)",
          border: "1.5px dashed var(--border)",
        }}
      >
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "var(--fg)" }}
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span
          className="text-xs tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          TRANSCRIBING YOUR ANSWER...
        </span>
      </div>
    );
  }

  // ── Render: preview ────────────────────────────────────────────────────────
  if (recorderState === "preview") {
    return (
      <div
        className="p-4 space-y-4"
        style={{
          background: "var(--white)",
          border: "1.5px dashed var(--border)",
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-xs tracking-[0.14em] uppercase"
            style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
          >
            RECORDING PREVIEW — {formatDuration(duration)}
          </span>
        </div>

        {audioUrl && (
          <audio
            controls
            src={audioUrl}
            className="w-full h-10"
            style={{ accentColor: "var(--fg)" }}
          />
        )}

        {error && (
          <p
            className="text-xs leading-relaxed"
            style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
          >
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={reRecord}
            className="flex-1 py-3 text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-70"
            style={{
              fontFamily: "var(--font-space-mono)",
              background: "var(--bg-surface)",
              color: "var(--muted)",
              border: "1.5px dashed var(--border)",
            }}
          >
            RE-RECORD
          </button>
          <button
            onClick={useRecording}
            className="flex-1 py-3 text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-80"
            style={{
              fontFamily: "var(--font-space-mono)",
              background: "var(--fg)",
              color: "var(--white)",
            }}
          >
            USE THIS RECORDING
          </button>
        </div>
      </div>
    );
  }

  // ── Render: recording ──────────────────────────────────────────────────────
  if (recorderState === "recording") {
    return (
      <div
        className="flex items-center gap-4 px-4 py-4"
        style={{
          background: "var(--white)",
          border: "1.5px dashed var(--border)",
        }}
      >
        {/* Pulsing red dot */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
            style={{ background: "#C0392B" }}
          />
          <span
            className="relative inline-flex rounded-full h-3 w-3"
            style={{ background: "#C0392B" }}
          />
        </span>

        <span
          className="text-xs tracking-[0.14em] uppercase tabular-nums"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--fg)" }}
        >
          REC {formatDuration(duration)}
        </span>

        <button
          onClick={stopRecording}
          className="ml-auto px-5 py-3 text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-80 min-w-[80px]"
          style={{
            fontFamily: "var(--font-space-mono)",
            background: "var(--fg)",
            color: "var(--white)",
          }}
        >
          STOP
        </button>
      </div>
    );
  }

  // ── Render: idle / requesting ──────────────────────────────────────────────
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={startRecording}
        disabled={recorderState === "requesting"}
        className="flex items-center gap-2 px-4 py-3 text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
        style={{
          fontFamily: "var(--font-space-mono)",
          background: "var(--bg-surface)",
          color: "var(--muted)",
          border: "1.5px dashed var(--border)",
        }}
        title="Answer by voice"
      >
        {/* Mic icon */}
        <svg
          className="h-4 w-4 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.8}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
          />
        </svg>
        {recorderState === "requesting" ? "REQUESTING..." : "SPEAK ANSWER"}
      </button>

      {!hasUsedVoice && (
        <span
          className="text-xs leading-relaxed"
          style={{ color: "var(--muted)", fontFamily: "var(--font-space-mono)" }}
        >
          you can also answer by voice
        </span>
      )}
    </div>
  );
}
