"use client";

import { useReducer, useCallback } from "react";
import {
  SessionState,
  SessionPhase,
  QuestionConfig,
  MCOption,
  FeedbackResult,
  AnswerMode,
} from "@/lib/types";

type Action =
  | { type: "GENERATE_QUESTION"; config: QuestionConfig }
  | { type: "QUESTION_LOADED"; question: string }
  | { type: "LOAD_OPTIONS" }
  | { type: "OPTIONS_LOADED"; options: MCOption[] }
  | { type: "SET_ANSWER_MODE"; mode: AnswerMode }
  | { type: "SUBMIT_ANSWER"; answer: string }
  | { type: "FEEDBACK_LOADED"; feedback: FeedbackResult }
  | { type: "ERROR"; error: string }
  | { type: "RESET" }
  | { type: "TRY_ANOTHER" };

const initialState: SessionState = {
  phase: "setup",
  config: null,
  question: null,
  options: null,
  answer: null,
  answerMode: "freetext",
  feedback: null,
  error: null,
};

function reducer(state: SessionState, action: Action): SessionState {
  switch (action.type) {
    case "GENERATE_QUESTION":
      return {
        ...initialState,
        phase: "loading-question",
        config: action.config,
      };
    case "QUESTION_LOADED":
      return { ...state, phase: "answering", question: action.question, error: null };
    case "LOAD_OPTIONS":
      return { ...state, phase: "loading-options" };
    case "OPTIONS_LOADED":
      return {
        ...state,
        phase: "answering",
        options: action.options,
        answerMode: "multiple-choice",
      };
    case "SET_ANSWER_MODE":
      return { ...state, answerMode: action.mode };
    case "SUBMIT_ANSWER":
      return {
        ...state,
        phase: "loading-feedback",
        answer: action.answer,
      };
    case "FEEDBACK_LOADED":
      return { ...state, phase: "feedback", feedback: action.feedback };
    case "ERROR":
      return {
        ...state,
        phase: state.config ? "answering" : "setup",
        error: action.error,
      };
    case "RESET":
      return initialState;
    case "TRY_ANOTHER":
      return {
        ...initialState,
        phase: "loading-question",
        config: state.config,
      };
    default:
      return state;
  }
}

export function usePracticeSession() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const generateQuestion = useCallback(async (config: QuestionConfig) => {
    dispatch({ type: "GENERATE_QUESTION", config });
    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error("Failed to generate question");
      const data = await res.json();
      dispatch({ type: "QUESTION_LOADED", question: data.question });
    } catch {
      dispatch({ type: "ERROR", error: "Failed to generate question. Please try again." });
    }
  }, []);

  const loadOptions = useCallback(async () => {
    if (!state.question || !state.config) return;
    dispatch({ type: "LOAD_OPTIONS" });
    try {
      const res = await fetch("/api/generate-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: state.question,
          type: state.config.type,
          difficulty: state.config.difficulty,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate options");
      const data = await res.json();
      dispatch({ type: "OPTIONS_LOADED", options: data.options });
    } catch {
      dispatch({ type: "ERROR", error: "Failed to generate options. Please try again." });
    }
  }, [state.question, state.config]);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!state.question || !state.config) return;
      dispatch({ type: "SUBMIT_ANSWER", answer });
      try {
        const res = await fetch("/api/evaluate-answer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: state.question,
            type: state.config.type,
            difficulty: state.config.difficulty,
            answer,
            answerMode: state.answerMode,
          }),
        });
        if (!res.ok) throw new Error("Failed to evaluate answer");
        const data = await res.json();
        dispatch({ type: "FEEDBACK_LOADED", feedback: data });
      } catch {
        dispatch({
          type: "ERROR",
          error: "Failed to evaluate your answer. Please try again.",
        });
      }
    },
    [state.question, state.config, state.answerMode]
  );

  const setAnswerMode = useCallback((mode: AnswerMode) => {
    dispatch({ type: "SET_ANSWER_MODE", mode });
  }, []);

  const reset = useCallback(() => dispatch({ type: "RESET" }), []);
  const tryAnother = useCallback(() => {
    if (state.config) generateQuestion(state.config);
  }, [state.config, generateQuestion]);

  return {
    state,
    generateQuestion,
    loadOptions,
    submitAnswer,
    setAnswerMode,
    reset,
    tryAnother,
  };
}
