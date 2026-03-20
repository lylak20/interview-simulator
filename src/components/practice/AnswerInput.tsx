"use client";

import { useState, useRef, useCallback } from "react";
import Button from "@/components/ui/Button";
import MultipleChoicePanel from "./MultipleChoicePanel";
import Spinner from "@/components/ui/Spinner";
import { AnswerMode, ChoiceOption, Question } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  question: Question;
  jobDescription?: string;
  onSubmit: (params: {
    answerMode: AnswerMode;
    freeformText?: string;
    chosenOption?: ChoiceOption;
  }) => void;
  submitting: boolean;
}

export default function AnswerInput({ question, jobDescription, onSubmit, submitting }: Props) {
  const [mode, setMode] = useState<AnswerMode>("freeform");
  const [freeformText, setFreeformText] = useState("");
  const [choices, setChoices] = useState<ChoiceOption[] | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<ChoiceOption | null>(null);
  const [loadingChoices, setLoadingChoices] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchChoices = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingChoices(true);
    try {
      const res = await fetch("/api/generate-choices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, jobDescription }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setChoices(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") {
        console.error(err);
      }
    } finally {
      setLoadingChoices(false);
    }
  }, [question, jobDescription]);

  function handleModeChange(newMode: AnswerMode) {
    setMode(newMode);
    if (newMode === "multiple-choice" && !choices) {
      fetchChoices();
    }
    if (newMode === "freeform") {
      abortRef.current?.abort();
    }
  }

  const canSubmit =
    !submitting &&
    (mode === "freeform"
      ? freeformText.trim().length > 0
      : selectedChoice !== null);

  function handleSubmit() {
    onSubmit({
      answerMode: mode,
      freeformText: mode === "freeform" ? freeformText : undefined,
      chosenOption: mode === "multiple-choice" ? selectedChoice ?? undefined : undefined,
    });
  }

  return (
    <div className="space-y-5">
      {/* Mode Toggle */}
      <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 gap-1">
        {(["freeform", "multiple-choice"] as AnswerMode[]).map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={cn(
              "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-150",
              mode === m
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            {m === "freeform" ? "Write Answer" : "Multiple Choice"}
          </button>
        ))}
      </div>

      {/* Freeform */}
      {mode === "freeform" && (
        <div className="space-y-2">
          <textarea
            value={freeformText}
            onChange={(e) => setFreeformText(e.target.value)}
            placeholder={
              question.type === "behavioral"
                ? "Use the STAR method: describe the Situation, your Task, the Actions you took, and the measurable Results…"
                : question.type === "metrics"
                ? "Walk through your answer step by step — state the formula, calculate if applicable, then interpret what the result means for an investor…"
                : "Describe how you'd approach this situation and why…"
            }
            rows={8}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-none leading-relaxed"
          />
          <div className="text-xs text-slate-400 text-right">
            {freeformText.length} characters
          </div>
        </div>
      )}

      {/* Multiple Choice */}
      {mode === "multiple-choice" && (
        <>
          {loadingChoices ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-500 text-sm">
              <Spinner className="w-4 h-4" />
              Generating answer options…
            </div>
          ) : choices ? (
            <MultipleChoicePanel
              choices={choices}
              selected={selectedChoice}
              onSelect={setSelectedChoice}
            />
          ) : null}
        </>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        loading={submitting}
        size="lg"
        className="w-full"
      >
        {submitting ? "Analyzing your answer…" : "Submit for Feedback"}
      </Button>
    </div>
  );
}
