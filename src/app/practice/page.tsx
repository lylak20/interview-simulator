"use client";

import Link from "next/link";
import { usePracticeSession } from "@/hooks/usePracticeSession";
import QuestionSetup from "@/components/practice/QuestionSetup";
import QuestionDisplay from "@/components/practice/QuestionDisplay";
import AnswerInput from "@/components/practice/AnswerInput";
import FeedbackDisplay from "@/components/practice/FeedbackDisplay";

export default function PracticePage() {
  const {
    state,
    generateQuestion,
    loadOptions,
    submitAnswer,
    setAnswerMode,
    reset,
    tryAnother,
  } = usePracticeSession();

  const isLoadingQuestion = state.phase === "loading-question";
  const isLoadingOptions = state.phase === "loading-options";
  const isLoadingFeedback = state.phase === "loading-feedback";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <header
        className="px-6 py-4"
        style={{ borderBottom: "1.5px dashed var(--border)" }}
      >
        <div className="mx-auto max-w-2xl flex items-center justify-between">
          <Link
            href="/"
            className="font-bold tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
            style={{
              fontFamily: "var(--font-space-mono)",
              fontSize: "0.875rem",
              color: "var(--fg)",
            }}
          >
            NOGGIN
          </Link>
          <div className="flex items-center gap-4">
            <span
              className="text-xs tracking-[0.14em] uppercase"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
            >
              {state.phase !== "setup"
                ? state.config?.type?.toUpperCase()
                : "SESSION"}
            </span>
            {state.phase !== "setup" && (
              <button
                onClick={reset}
                className="text-xs tracking-[0.14em] uppercase transition-opacity hover:opacity-70"
                style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
              >
                ✕ RESET
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* Error banner */}
        {state.error && (
          <div
            className="mb-6 px-4 py-3 flex items-center justify-between"
            style={{
              background: "var(--bg-surface)",
              border: "1.5px dashed var(--border)",
            }}
          >
            <span
              className="text-xs tracking-[0.1em]"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--fg)" }}
            >
              {state.error}
            </span>
            <button
              onClick={() => setAnswerMode(state.answerMode)}
              className="text-xs tracking-[0.14em] uppercase ml-4 transition-opacity hover:opacity-70"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
            >
              DISMISS
            </button>
          </div>
        )}

        {/* Setup */}
        {state.phase === "setup" && (
          <div>
            <p
              className="text-xs tracking-[0.2em] uppercase mb-1"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
            >
              CURRENT STATE
            </p>
            <h1
              className="text-2xl font-bold tracking-tight mb-8"
              style={{ color: "var(--fg)" }}
            >
              SET UP SESSION
            </h1>
            <QuestionSetup onGenerate={generateQuestion} loading={false} />
          </div>
        )}

        {/* Loading question */}
        {isLoadingQuestion && (
          <div className="flex flex-col items-center justify-center py-24">
            <svg
              className="animate-spin h-8 w-8 mb-4"
              style={{ color: "var(--fg)" }}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
            >
              GENERATING QUESTION...
            </p>
          </div>
        )}

        {/* Answering */}
        {(state.phase === "answering" || isLoadingOptions || isLoadingFeedback) &&
          state.question &&
          state.config && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <p
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
                >
                  YOUR QUESTION
                </p>
              </div>
              <QuestionDisplay
                question={state.question}
                type={state.config.type}
                difficulty={state.config.difficulty}
              />
              <div style={{ borderTop: "1.5px dashed var(--border)", paddingTop: "1rem" }}>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-4"
                  style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
                >
                  YOUR RESPONSE
                </p>
                <AnswerInput
                  answerMode={state.answerMode}
                  options={state.options}
                  onSetMode={setAnswerMode}
                  onLoadOptions={loadOptions}
                  onSubmit={submitAnswer}
                  loadingOptions={isLoadingOptions}
                  loadingFeedback={isLoadingFeedback}
                />
              </div>
            </div>
          )}

        {/* Feedback */}
        {state.phase === "feedback" &&
          state.question &&
          state.answer &&
          state.feedback &&
          state.config && (
            <div>
              <p
                className="text-xs tracking-[0.2em] uppercase mb-1"
                style={{ fontFamily: "var(--font-space-mono)", color: "var(--muted)" }}
              >
                RECENT LOGS
              </p>
              <h1
                className="text-2xl font-bold tracking-tight mb-6"
                style={{ color: "var(--fg)" }}
              >
                FEEDBACK
              </h1>
              <FeedbackDisplay
                question={state.question}
                answer={state.answer}
                feedback={state.feedback}
                questionType={state.config.type}
                onTryAnother={tryAnother}
                onReset={reset}
              />
            </div>
          )}
      </main>
    </div>
  );
}
