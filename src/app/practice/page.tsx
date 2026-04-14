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
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-bold text-slate-900">
            InterviewPrep <span className="text-indigo-600">AI</span>
          </Link>
          {state.phase !== "setup" && (
            <button
              onClick={reset}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        {state.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center justify-between">
            <span>{state.error}</span>
            <button
              onClick={() => setAnswerMode(state.answerMode)}
              className="text-red-600 font-medium hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {state.phase === "setup" && (
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Set Up Your Practice Session
            </h1>
            <p className="text-slate-600 mb-8">
              Choose a question type and difficulty level to get started.
            </p>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <QuestionSetup
                onGenerate={generateQuestion}
                loading={false}
              />
            </div>
          </div>
        )}

        {isLoadingQuestion && (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-600 font-medium">Generating your question...</p>
          </div>
        )}

        {(state.phase === "answering" ||
          isLoadingOptions ||
          isLoadingFeedback) &&
          state.question &&
          state.config && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-slate-900">
                Your Interview Question
              </h1>
              <QuestionDisplay
                question={state.question}
                type={state.config.type}
                difficulty={state.config.difficulty}
              />
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
          )}

        {state.phase === "feedback" &&
          state.question &&
          state.answer &&
          state.feedback &&
          state.config && (
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-6">
                Your Feedback
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
