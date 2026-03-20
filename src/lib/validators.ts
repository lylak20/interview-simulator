import { z } from "zod";

export const QuestionTypeSchema = z.enum(["metrics", "behavioral", "situational"]);
export const DifficultySchema = z.enum(["easy", "medium", "hard"]);

export const GenerateQuestionSchema = z.object({
  type: QuestionTypeSchema,
  difficulty: DifficultySchema,
  jobDescription: z.string().max(3000).optional(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: QuestionTypeSchema,
  difficulty: DifficultySchema,
  context: z.string().optional(),
  hints: z.array(z.string()).optional(),
  metricFocus: z.string().optional(),
});

export const ChoiceOptionSchema = z.object({
  id: z.enum(["A", "B", "C", "D"]),
  label: z.string(),
  rationale: z.string().optional(),
});

export const GenerateChoicesSchema = z.object({
  question: QuestionSchema,
  jobDescription: z.string().max(3000).optional(),
});

export const AnalyzeAnswerSchema = z
  .object({
    question: QuestionSchema,
    answerMode: z.enum(["freeform", "multiple-choice"]),
    freeformText: z.string().max(5000).optional(),
    chosenOption: ChoiceOptionSchema.optional(),
    jobDescription: z.string().max(3000).optional(),
  })
  .refine(
    (d) =>
      d.answerMode === "freeform"
        ? (d.freeformText?.trim().length ?? 0) > 0
        : !!d.chosenOption,
    { message: "Answer content required for the selected mode" }
  );
