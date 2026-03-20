"use client";

import { FeedbackResult, Question } from "@/types";
import StarBreakdown from "./StarBreakdown";
import MetricAccuracyBlock from "./MetricAccuracyBlock";
import { cn } from "@/lib/utils";

interface Props {
  feedback: FeedbackResult;
  question: Question;
  onTryAnother: () => void;
  onSameType: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 8
      ? "text-green-600 border-green-300 bg-green-50"
      : score >= 5
      ? "text-amber-600 border-amber-300 bg-amber-50"
      : "text-red-600 border-red-300 bg-red-50";

  return (
    <div
      className={cn(
        "w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center flex-shrink-0",
        color
      )}
    >
      <span className="text-2xl font-bold leading-none">{score}</span>
      <span className="text-xs font-medium opacity-75">/10</span>
    </div>
  );
}

export default function FeedbackPanel({ feedback, question, onTryAnother, onSameType }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header: score + summary */}
      <div className="flex items-start gap-5">
        <ScoreRing score={feedback.overallScore} />
        <div className="flex-1">
          <p className="text-base text-slate-700 leading-relaxed">{feedback.summary}</p>
        </div>
      </div>

      {/* Metric accuracy (metrics type only) */}
      {feedback.metricAccuracy && (
        <MetricAccuracyBlock metricAccuracy={feedback.metricAccuracy} />
      )}

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for improvement */}
      {feedback.improvements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missed points */}
      {feedback.missedPoints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-2.5 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Key Points Missed
          </h3>
          <ul className="space-y-2">
            {feedback.missedPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* STAR Breakdown (behavioral only) */}
      {feedback.starBreakdown && feedback.starBreakdown.length > 0 && (
        <StarBreakdown scores={feedback.starBreakdown} />
      )}

      {/* Example response */}
      {feedback.exampleResponse && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Model Answer / Key Approach
          </h3>
          <p className="text-sm text-slate-700 italic leading-relaxed">
            &ldquo;{feedback.exampleResponse}&rdquo;
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100">
        <button
          onClick={onTryAnother}
          className="flex-1 py-3 px-4 rounded-xl border-2 border-brand text-brand font-semibold text-sm hover:bg-brand/5 transition-colors"
        >
          Try a Different Question
        </button>
        <button
          onClick={onSameType}
          className="flex-1 py-3 px-4 rounded-xl bg-brand text-white font-semibold text-sm hover:bg-brand-dark transition-colors shadow-sm"
        >
          Practice Same Type
        </button>
      </div>
    </div>
  );
}
