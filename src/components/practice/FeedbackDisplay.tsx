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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-semibold text-indigo-600">{score}/5</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all"
          style={{ width: `${(score / 5) * 100}%` }}
        />
      </div>
      <p className="text-xs text-slate-500">{comment}</p>
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Question
        </h3>
        <p className="text-slate-800">{question}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
          Your Answer
        </h3>
        <p className="text-slate-700 whitespace-pre-wrap">{answer}</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
          Overall Assessment
        </h3>
        <p className="text-slate-700 leading-relaxed">
          {feedback.overallAssessment}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
          <h3 className="text-sm font-semibold text-green-800 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-green-900 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h3 className="text-sm font-semibold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((imp, i) => (
              <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {questionType === "behavioral" && feedback.starEvaluation && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
          <h3 className="text-sm font-semibold text-indigo-800 uppercase tracking-wide mb-4 flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            STAR Framework Evaluation
          </h3>
          <div className="space-y-4">
            <StarBar
              label="Situation"
              score={feedback.starEvaluation.situation.score}
              comment={feedback.starEvaluation.situation.comment}
            />
            <StarBar
              label="Task"
              score={feedback.starEvaluation.task.score}
              comment={feedback.starEvaluation.task.comment}
            />
            <StarBar
              label="Action"
              score={feedback.starEvaluation.action.score}
              comment={feedback.starEvaluation.action.comment}
            />
            <StarBar
              label="Result"
              score={feedback.starEvaluation.result.score}
              comment={feedback.starEvaluation.result.comment}
            />
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onTryAnother}
          className="flex-1 rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-md hover:bg-indigo-700 transition-colors"
        >
          Try Another Question
        </button>
        <button
          onClick={onReset}
          className="flex-1 rounded-xl border border-slate-300 py-3.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          New Setup
        </button>
      </div>
    </div>
  );
}
