"use client";

import { useState } from "react";
import { AnswerMode, MCOption } from "@/lib/types";
import VoiceRecorder from "./VoiceRecorder";

interface Props {
  answerMode: AnswerMode;
  options: MCOption[] | null;
  onSetMode: (mode: AnswerMode) => void;
  onLoadOptions: () => void;
  onSubmit: (answer: string) => void;
  loadingOptions: boolean;
  loadingFeedback: boolean;
}

export default function AnswerInput({
  answerMode,
  options,
  onSetMode,
  onLoadOptions,
  onSubmit,
  loadingOptions,
  loadingFeedback,
}: Props) {
  const [textAnswer, setTextAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleModeSwitch = (mode: AnswerMode) => {
    if (mode === "multiple-choice" && !options) {
      onLoadOptions();
    } else {
      onSetMode(mode);
    }
  };

  const handleSubmit = () => {
    if (answerMode === "freetext") {
      if (textAnswer.trim()) onSubmit(textAnswer.trim());
    } else if (selectedOption && options) {
      const selected = options.find((o) => o.id === selectedOption);
      if (selected) onSubmit(`${selected.id}: ${selected.text}`);
    }
  };

  // Called by VoiceRecorder once transcript is ready — drops text into the box
  const handleTranscript = (text: string) => {
    setTextAnswer((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed} ${text}` : text;
    });
  };

  const canSubmit =
    answerMode === "freetext"
      ? textAnswer.trim().length > 0
      : selectedOption !== null;

  const loading = loadingFeedback;

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex gap-0">
        {(
          [
            ["freetext", "WRITE ANSWER"],
            ["multiple-choice", "MULTIPLE CHOICE"],
          ] as const
        ).map(([mode, label]) => (
          <button
            key={mode}
            type="button"
            onClick={() => handleModeSwitch(mode)}
            disabled={loadingOptions && mode === "multiple-choice"}
            className="px-4 py-2.5 flex items-center gap-2 transition-opacity disabled:opacity-50"
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              background: answerMode === mode ? "var(--fg)" : "var(--bg-surface)",
              color: answerMode === mode ? "var(--white)" : "var(--muted)",
            }}
          >
            {loadingOptions && mode === "multiple-choice" && (
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {label}
          </button>
        ))}
      </div>

      {/* Free text mode */}
      {answerMode === "freetext" ? (
        <div className="space-y-3">
          {/* Voice recorder — sits above textarea, transcript flows into it */}
          <VoiceRecorder onTranscript={handleTranscript} />

          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Write your answer here. For behavioral questions, follow the STAR format: Situation, Task, Action, Result..."
            className="w-full px-4 py-3 text-sm focus:outline-none min-h-[180px] resize-y"
            style={{
              background: "var(--white)",
              color: "var(--fg)",
              border: "1.5px dashed var(--border)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          />
        </div>
      ) : options ? (
        /* Multiple-choice mode */
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-start gap-3 p-4 cursor-pointer transition-all"
              style={{
                background:
                  selectedOption === option.id
                    ? "var(--fg)"
                    : "var(--bg-surface)",
                color:
                  selectedOption === option.id ? "var(--white)" : "var(--fg)",
                border: "1.5px dashed var(--border)",
              }}
            >
              <input
                type="radio"
                name="answer-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                style={{ accentColor: "var(--fg)" }}
              />
              <div className="text-sm">
                <span
                  className="font-bold mr-2"
                  style={{ fontFamily: "var(--font-space-mono)", fontSize: "0.7rem" }}
                >
                  {option.id}.
                </span>
                {option.text}
              </div>
            </label>
          ))}
        </div>
      ) : null}

      {/* Submit — identical flow whether typed or voice */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full py-4 font-bold tracking-[0.2em] uppercase transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          fontFamily: "var(--font-space-mono)",
          fontSize: "0.75rem",
          background: "var(--fg)",
          color: "var(--white)",
        }}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? "ANALYZING..." : "LOG IT"}
      </button>
    </div>
  );
}
