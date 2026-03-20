"use client";

import { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Question } from "@/types";

interface Props {
  question: Question;
}

const typeBadge: Record<Question["type"], { label: string; variant: "purple" | "blue" | "amber" }> = {
  metrics: { label: "Metrics & Technical", variant: "purple" },
  behavioral: { label: "Behavioral", variant: "blue" },
  situational: { label: "Situational", variant: "amber" },
};

const diffBadge: Record<Question["difficulty"], { label: string; variant: "green" | "amber" | "red" }> = {
  easy: { label: "Easy", variant: "green" },
  medium: { label: "Medium", variant: "amber" },
  hard: { label: "Hard", variant: "red" },
};

export default function QuestionCard({ question }: Props) {
  const [showHints, setShowHints] = useState(false);
  const type = typeBadge[question.type];
  const diff = diffBadge[question.difficulty];

  return (
    <div className="space-y-4">
      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={type.variant}>{type.label}</Badge>
        <Badge variant={diff.variant}>{diff.label}</Badge>
        {question.metricFocus && (
          <Badge variant="slate">{question.metricFocus}</Badge>
        )}
      </div>

      {/* Scenario context */}
      {question.context && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-500 text-xs uppercase tracking-wide">
            Scenario
          </span>
          <p className="mt-1">{question.context}</p>
        </div>
      )}

      {/* Question text */}
      <p className="text-xl font-medium text-slate-900 leading-snug">{question.text}</p>

      {/* Hints toggle */}
      {question.hints && question.hints.length > 0 && (
        <div>
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-sm text-brand hover:text-brand-dark font-medium flex items-center gap-1.5 transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showHints ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            {showHints ? "Hide hints" : "Show hints"}
          </button>
          {showHints && (
            <ul className="mt-2 space-y-1.5 pl-4">
              {question.hints.map((hint, i) => (
                <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  {hint}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
