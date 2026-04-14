export type QuestionType = "behavioral" | "case" | "situational";
export type Difficulty = "easy" | "medium" | "hard";
export type AnswerMode = "freetext" | "multiple-choice";

export interface QuestionConfig {
  type: QuestionType;
  difficulty: Difficulty;
  jobDescription?: string;
}

export interface GeneratedQuestion {
  question: string;
  type: QuestionType;
  difficulty: Difficulty;
}

export interface MCOption {
  id: string;
  text: string;
}

export interface StarScore {
  score: number;
  comment: string;
}

export interface StarEvaluation {
  situation: StarScore;
  task: StarScore;
  action: StarScore;
  result: StarScore;
}

export interface FeedbackResult {
  overallAssessment: string;
  strengths: string[];
  improvements: string[];
  starEvaluation?: StarEvaluation;
}

export type SessionPhase =
  | "setup"
  | "loading-question"
  | "answering"
  | "loading-options"
  | "loading-feedback"
  | "feedback";

export interface SessionState {
  phase: SessionPhase;
  config: QuestionConfig | null;
  question: string | null;
  options: MCOption[] | null;
  answer: string | null;
  answerMode: AnswerMode;
  feedback: FeedbackResult | null;
  error: string | null;
}
