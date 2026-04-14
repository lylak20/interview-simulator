"use client";

import { useState } from "react";
import { QuestionType, Difficulty, QuestionConfig } from "@/lib/types";

interface Props {
  onGenerate: (config: QuestionConfig) => void;
  loading: boolean;
}

export default function QuestionSetup({ onGenerate, loading }: Props) {
  const [type, setType] = useState<QuestionType>("behavioral");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [jobDescription, setJobDescription] = useState("");
  const [showJD, setShowJD] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      type,
      difficulty,
      jobDescription: jobDescription.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Question Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              ["behavioral", "Behavioral", "STAR method"],
              ["case", "Case Study", "Problem-solving"],
              ["situational", "Situational", "Judgment-based"],
            ] as const
          ).map(([value, label, sub]) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                type === value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900">{label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`rounded-xl border-2 py-3 px-4 capitalize font-medium transition-all ${
                difficulty === level
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowJD(!showJD)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          <svg
            className={`h-4 w-4 transition-transform ${showJD ? "rotate-90" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          Tailor to a job description
        </button>
        {showJD && (
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description or link here to generate role-specific questions..."
            className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none min-h-[120px] resize-y"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {loading ? "Generating Question..." : "Generate Question"}
      </button>
    </form>
  );
}
