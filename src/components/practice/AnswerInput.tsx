"use client";

import { useState } from "react";
import { AnswerMode, MCOption } from "@/lib/types";

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

  const canSubmit =
    answerMode === "freetext"
      ? textAnswer.trim().length > 0
      : selectedOption !== null;

  const loading = loadingFeedback;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeSwitch("freetext")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            answerMode === "freetext"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Write Answer
        </button>
        <button
          type="button"
          onClick={() => handleModeSwitch("multiple-choice")}
          disabled={loadingOptions}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
            answerMode === "multiple-choice"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {loadingOptions && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          Multiple Choice
        </button>
      </div>

      {answerMode === "freetext" ? (
        <textarea
          value={textAnswer}
          onChange={(e) => setTextAnswer(e.target.value)}
          placeholder="Write your answer here. For behavioral questions, try to follow the STAR format: Situation, Task, Action, Result..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none min-h-[180px] resize-y"
        />
      ) : options ? (
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-start gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all ${
                selectedOption === option.id
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="answer-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <span className="font-semibold text-slate-700 mr-2">
                  {option.id}.
                </span>
                <span className="text-slate-700">{option.text}</span>
              </div>
            </label>
          ))}
        </div>
      ) : null}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || loading}
        className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? "Analyzing Your Answer..." : "Submit Answer"}
      </button>
    </div>
  );
}
