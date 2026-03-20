// Primary: metrics/technical; Secondary: behavioral, situational
export type QuestionType = "metrics" | "behavioral" | "situational";
export type Difficulty = "easy" | "medium" | "hard";
export type AnswerMode = "freeform" | "multiple-choice";
export type AppStage = "configure" | "question" | "submitting" | "feedback";

export interface QuestionConfig {
  type: QuestionType;
  difficulty: Difficulty;
  jobDescription?: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: Difficulty;
  context?: string;
  hints?: string[];
  metricFocus?: string; // e.g. "Sales Magic Number", "NRR", "Rule of 40"
}

export interface ChoiceOption {
  id: "A" | "B" | "C" | "D";
  label: string;
  rationale?: string;
}

export interface STARScore {
  component: "Situation" | "Task" | "Action" | "Result";
  score: 1 | 2 | 3 | 4 | 5;
  comment: string;
}

export interface FeedbackResult {
  overallScore: number; // 1–10
  summary: string;
  strengths: string[];
  improvements: string[];
  missedPoints: string[];
  starBreakdown?: STARScore[]; // only for behavioral type
  metricAccuracy?: {
    formulaCorrect: boolean;
    interpretationQuality: "excellent" | "good" | "partial" | "poor";
    investmentContextualized: boolean;
    details: string;
  }; // only for metrics type
  exampleResponse?: string;
}
