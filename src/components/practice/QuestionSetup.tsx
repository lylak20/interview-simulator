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
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Question type */}
      <div>
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          QUESTION TYPE
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ["behavioral", "BEHAVIORAL", "STAR method"],
              ["case", "CASE", "Problem-solving"],
              ["situational", "SITUATIONAL", "Judgment-based"],
            ] as const
          ).map(([value, label, sub]) => (
            <button
              key={value}
              type="button"
              onClick={() => setType(value)}
              className="p-4 text-left transition-all"
              style={{
                background: type === value ? "var(--fg)" : "var(--bg-surface)",
                color: type === value ? "var(--white)" : "var(--fg)",
              }}
            >
              <div
                className="text-xs font-bold tracking-[0.1em] uppercase"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {label}
              </div>
              <div
                className="text-xs mt-1 opacity-60"
                style={{ fontFamily: "var(--font-space-mono)" }}
              >
                {sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "1.5rem" }}>
        <p
          className="text-xs tracking-[0.2em] uppercase mb-4"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          DIFFICULTY
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(["easy", "medium", "hard"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className="py-3 px-4 transition-all"
              style={{
                background: difficulty === level ? "var(--fg)" : "var(--bg-surface)",
                color: difficulty === level ? "var(--white)" : "var(--muted)",
                fontFamily: "var(--font-space-mono)",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Job description */}
      <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setShowJD(!showJD)}
          className="flex items-center gap-2 transition-opacity hover:opacity-70"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
          }}
        >
          <span>{showJD ? "▾" : "▸"}</span>
          TAILOR TO A JOB DESCRIPTION
        </button>
        {showJD && (
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description or link here..."
            className="mt-3 w-full px-4 py-3 text-sm focus:outline-none min-h-[120px] resize-y"
            style={{
              background: "var(--bg-surface)",
              color: "var(--fg)",
              border: "1.5px dashed var(--border)",
              fontFamily: "var(--font-space-grotesk)",
            }}
          />
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 font-bold tracking-[0.2em] uppercase transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        {loading ? "GENERATING..." : "GENERATE QUESTION"}
      </button>
    </form>
  );
}
