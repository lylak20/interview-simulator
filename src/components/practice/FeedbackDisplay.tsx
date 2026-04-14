"use client";

import { FeedbackResult } from "@/lib/types";

interface Props {
  question: string;
  answer: string;
  feedback: FeedbackResult;
  questionType: string;
  onTryAnother: () => void;
  onReset: () => void;
}

function StarBar({ score, label, comment }: { score: number; label: string; comment: string }) {
  return (
    <div className="py-4" style={{ borderTop: "1.5px dashed var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs tracking-[0.14em] uppercase"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--fg)" }}
        >
          {label}
        </span>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
        >
          {score}/5
        </span>
      </div>
      <div
        className="h-1.5 mb-2 overflow-hidden"
        style={{ background: "var(--bg-surface)" }}
      >
        <div
          className="h-full transition-all"
          style={{
            width: `${(score / 5) * 100}%`,
            background: "var(--fg)",
          }}
        />
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
        {comment}
      </p>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="p-6"
      style={{
        background: "var(--white)",
        border: "1.5px dashed var(--border)",
      }}
    >
      <p
        className="text-xs tracking-[0.2em] uppercase mb-3"
        style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

export default function FeedbackDisplay({
  question,
  answer,
  feedback,
  questionType,
  onTryAnother,
  onReset,
}: Props) {
  return (
    <div className="space-y-3">
      <Section label="QUESTION">
        <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
          {question}
        </p>
      </Section>

      <Section label="YOUR ANSWER">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--muted)" }}
        >
          {answer}
        </p>
      </Section>

      <Section label="OVERALL">
        <p className="text-sm leading-relaxed" style={{ color: "var(--fg)" }}>
          {feedback.overallAssessment}
        </p>
      </Section>

      <div className="grid gap-3 sm:grid-cols-2">
        {/* Strengths */}
        <div
          className="p-6"
          style={{
            background: "var(--white)",
            border: "1.5px dashed var(--border)",
          }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
          >
            STRENGTHS
          </p>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--fg)" }}>
                <span
                  className="mt-2 h-1 w-1 shrink-0"
                  style={{ background: "var(--fg)" }}
                />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div
          className="p-6"
          style={{
            background: "var(--white)",
            border: "1.5px dashed var(--border)",
          }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
          >
            AREAS TO WORK ON
          </p>
          <ul className="space-y-2">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="text-sm flex items-start gap-2" style={{ color: "var(--muted)" }}>
                <span
                  className="mt-2 h-1 w-1 shrink-0"
                  style={{ background: "var(--muted)" }}
                />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {questionType === "behavioral" && feedback.starEvaluation && (
        <div
          className="p-6"
          style={{
            background: "var(--white)",
            border: "1.5px dashed var(--border)",
          }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
          >
            STAR FRAMEWORK
          </p>
          <StarBar label="SITUATION" score={feedback.starEvaluation.situation.score} comment={feedback.starEvaluation.situation.comment} />
          <StarBar label="TASK" score={feedback.starEvaluation.task.score} comment={feedback.starEvaluation.task.comment} />
          <StarBar label="ACTION" score={feedback.starEvaluation.action.score} comment={feedback.starEvaluation.action.comment} />
          <StarBar label="RESULT" score={feedback.starEvaluation.result.score} comment={feedback.starEvaluation.result.comment} />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={onTryAnother}
          className="flex-1 py-4 font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.7rem",
            background: "var(--fg)",
            color: "var(--white)",
          }}
        >
          TRY ANOTHER
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-4 font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
          style={{
            fontFamily: "var(--font-space-mono)",
            fontSize: "0.7rem",
            background: "var(--bg-surface)",
            color: "var(--muted)",
            border: "1.5px dashed var(--border)",
          }}
        >
          NEW SESSION
        </button>
      </div>
    </div>
  );
}
