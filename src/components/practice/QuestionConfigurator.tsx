"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { QuestionConfig, QuestionType, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  onSubmit: (config: QuestionConfig) => void;
  loading: boolean;
}

const questionTypes: { value: QuestionType; label: string; desc: string; color: string }[] = [
  {
    value: "metrics",
    label: "Metrics & Technical",
    desc: "ARR, NRR, Rule of 40, Magic Number…",
    color: "border-purple-400 bg-purple-50 text-purple-700",
  },
  {
    value: "behavioral",
    label: "Behavioral (STAR)",
    desc: "IC dynamics, diligence, leadership…",
    color: "border-blue-400 bg-blue-50 text-blue-700",
  },
  {
    value: "situational",
    label: "Situational Judgment",
    desc: "Deal dilemmas, ethical gray areas…",
    color: "border-amber-400 bg-amber-50 text-amber-700",
  },
];

const difficulties: { value: Difficulty; label: string; desc: string }[] = [
  { value: "easy", label: "Easy", desc: "Definitions & formulas" },
  { value: "medium", label: "Medium", desc: "Calculate & interpret" },
  { value: "hard", label: "Hard", desc: "Diagnose & invest" },
];

const URL_REGEX = /^https?:\/\//i;

export default function QuestionConfigurator({ onSubmit, loading }: Props) {
  const [type, setType] = useState<QuestionType>("metrics");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [showJD, setShowJD] = useState(false);
  const [jdText, setJdText] = useState("");
  const [jdError, setJdError] = useState("");

  function handleJdChange(val: string) {
    setJdText(val);
    if (URL_REGEX.test(val.trim())) {
      setJdError("Please paste the job description text, not a URL.");
    } else {
      setJdError("");
    }
  }

  function handleSubmit() {
    if (jdError) return;
    onSubmit({
      type,
      difficulty,
      jobDescription: showJD && jdText.trim() ? jdText.trim() : undefined,
    });
  }

  return (
    <div className="space-y-8">
      {/* Question Type */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Question Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {questionTypes.map((qt) => (
            <button
              key={qt.value}
              onClick={() => setType(qt.value)}
              className={cn(
                "text-left p-4 rounded-xl border-2 transition-all duration-150",
                type === qt.value
                  ? qt.color + " shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
            >
              <div className="font-semibold text-sm mb-0.5">{qt.label}</div>
              <div className="text-xs opacity-75">{qt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Difficulty
        </label>
        <div className="flex gap-3">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={cn(
                "flex-1 p-3 rounded-xl border-2 text-center transition-all duration-150",
                difficulty === d.value
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
            >
              <div className="font-semibold text-sm">{d.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Job Description Toggle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">
            Job Description Context{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <button
            onClick={() => setShowJD(!showJD)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
              showJD ? "bg-brand" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                showJD ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {showJD && (
          <div className="space-y-1.5">
            <textarea
              value={jdText}
              onChange={(e) => handleJdChange(e.target.value)}
              placeholder="Paste the job description text here to generate role-specific questions…"
              rows={5}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand resize-none"
            />
            {jdError && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {jdError}
              </p>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        loading={loading}
        disabled={!!jdError}
        size="lg"
        className="w-full"
      >
        {loading ? "Generating question…" : "Generate Question"}
      </Button>
    </div>
  );
}
