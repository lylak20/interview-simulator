"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import QuestionConfigurator from "./QuestionConfigurator";
import QuestionCard from "./QuestionCard";
import AnswerInput from "./AnswerInput";
import FeedbackPanel from "@/components/feedback/FeedbackPanel";
import {
  AppStage,
  AnswerMode,
  ChoiceOption,
  FeedbackResult,
  Question,
  QuestionConfig,
  QuestionType,
} from "@/types";

export default function PracticeOrchestrator() {
  const [stage, setStage] = useState<AppStage>("configure");
  const [config, setConfig] = useState<QuestionConfig | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [generatingQ, setGeneratingQ] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleGenerateQuestion(cfg: QuestionConfig) {
    setConfig(cfg);
    setGeneratingQ(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate question");
      }
      const q: Question = await res.json();
      setQuestion(q);
      setStage("question");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGeneratingQ(false);
    }
  }

  async function handleSubmitAnswer(params: {
    answerMode: AnswerMode;
    freeformText?: string;
    chosenOption?: ChoiceOption;
  }) {
    if (!question) return;
    setSubmitting(true);
    setStage("submitting");
    setStreamBuffer("");
    setError(null);

    try {
      const res = await fetch("/api/analyze-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          ...params,
          jobDescription: config?.jobDescription,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error("Failed to get feedback");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let parsedSuccessfully = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        setStreamBuffer(buffer);

        // Attempt JSON parse on each chunk
        try {
          const parsed = JSON.parse(buffer.trim()) as FeedbackResult;
          setFeedback(parsed);
          setStage("feedback");
          parsedSuccessfully = true;
          break;
        } catch {
          // Not yet complete JSON — keep reading
        }
      }

      // Final attempt if loop ended without parse succeeding
      if (!parsedSuccessfully) {
        try {
          const parsed = JSON.parse(buffer.trim()) as FeedbackResult;
          setFeedback(parsed);
          setStage("feedback");
        } catch {
          throw new Error("Could not parse feedback response. Please try again.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("question");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setStage("configure");
    setQuestion(null);
    setFeedback(null);
    setStreamBuffer("");
    setError(null);
    setConfig(null);
  }

  function resetSameType() {
    setStage("configure");
    setQuestion(null);
    setFeedback(null);
    setStreamBuffer("");
    setError(null);
    // keep config so type/difficulty are pre-selected
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Interview Simulator</h1>
        <p className="text-slate-500 text-sm">
          VC &amp; Growth Equity · Powered by Claude
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {(["configure", "question", "feedback"] as const).map((s, i) => {
          const isActive = stage === s || (stage === "submitting" && s === "question");
          const isDone =
            (s === "configure" && (stage === "question" || stage === "submitting" || stage === "feedback")) ||
            (s === "question" && stage === "feedback");
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${
                  isDone
                    ? "bg-brand text-white"
                    : isActive
                    ? "bg-brand/20 text-brand border-2 border-brand"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs font-medium capitalize ${isActive ? "text-slate-800" : "text-slate-400"}`}>
                {s === "configure" ? "Configure" : s === "question" ? "Practice" : "Feedback"}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-slate-200 ml-1" />}
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Configure */}
      {stage === "configure" && (
        <Card>
          <QuestionConfigurator
            onSubmit={handleGenerateQuestion}
            loading={generatingQ}
          />
        </Card>
      )}

      {/* Question + Answer */}
      {(stage === "question" || stage === "submitting") && question && (
        <div className="space-y-5">
          <Card>
            <QuestionCard question={question} />
          </Card>
          <Card>
            <h2 className="text-sm font-semibold text-slate-600 mb-4">Your Answer</h2>
            <AnswerInput
              question={question}
              jobDescription={config?.jobDescription}
              onSubmit={handleSubmitAnswer}
              submitting={submitting}
            />
          </Card>

          {/* Live stream preview while submitting */}
          {stage === "submitting" && streamBuffer && (
            <Card className="border-brand/20 bg-brand/5">
              <div className="flex items-center gap-2 mb-3">
                <Spinner className="w-4 h-4" />
                <span className="text-sm font-medium text-brand">Analyzing your answer…</span>
              </div>
              <pre className="text-xs text-slate-500 overflow-auto max-h-24 whitespace-pre-wrap font-mono">
                {streamBuffer}
              </pre>
            </Card>
          )}

          {/* Loading state when no stream yet */}
          {stage === "submitting" && !streamBuffer && (
            <Card className="flex items-center justify-center py-8 gap-3 text-slate-500 text-sm">
              <Spinner className="w-4 h-4" />
              Getting feedback from Claude…
            </Card>
          )}

          <button
            onClick={resetAll}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors w-full text-center"
          >
            ← Start over
          </button>
        </div>
      )}

      {/* Feedback */}
      {stage === "feedback" && feedback && question && (
        <Card padding="lg">
          <FeedbackPanel
            feedback={feedback}
            question={question}
            onTryAnother={resetAll}
            onSameType={resetSameType}
          />
        </Card>
      )}
    </div>
  );
}
