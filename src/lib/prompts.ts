import { QuestionType, Difficulty } from "./types";

export function questionGenerationPrompt(
  type: QuestionType,
  difficulty: Difficulty,
  jobDescription?: string
): { system: string; user: string } {
  const typeGuidelines: Record<QuestionType, string> = {
    behavioral: `Ask about past experiences using "Tell me about a time..." format.
Easy = common workplace situations (teamwork, meeting deadlines).
Medium = challenging scenarios (conflict resolution, handling failure).
Hard = complex leadership, high-stakes decisions, or ethical dilemmas.`,
    case: `Present a business scenario requiring analysis and problem-solving.
Easy = straightforward problem with clear data.
Medium = multi-faceted scenario requiring trade-off analysis.
Hard = ambiguous situation with incomplete information and multiple stakeholders.`,
    situational: `Present a hypothetical workplace scenario and ask how the candidate would handle it.
Easy = clear right answer, testing basic judgment.
Medium = nuanced situation with multiple reasonable approaches.
Hard = genuine ethical/strategic dilemma with no obvious right answer.`,
  };

  const system = `You are an expert interview coach who creates realistic, thoughtful interview questions for job candidates. Generate exactly one ${type} interview question at ${difficulty} difficulty level.

${typeGuidelines[type]}

Respond with ONLY the question text. No preamble, no numbering, no quotes.`;

  let user = `Generate a ${difficulty} ${type} interview question.`;
  if (jobDescription) {
    user += `\n\nTailor the question to this job description:\n---\n${jobDescription}\n---`;
  }

  return { system, user };
}

export function optionsGenerationPrompt(
  question: string,
  type: QuestionType,
  difficulty: Difficulty
): { system: string; user: string } {
  const system = `You are an expert interview coach. Generate 4 answer options for an interview question. One should be excellent (demonstrates strong competency), one should be good (acceptable but missing depth), and two should be weak or poor (common mistakes candidates make). Randomize the order so the best answer is not always in the same position.

Respond in this exact JSON format and nothing else:
{"options": [{"id": "A", "text": "..."}, {"id": "B", "text": "..."}, {"id": "C", "text": "..."}, {"id": "D", "text": "..."}]}`;

  const user = `Question (${type}, ${difficulty}): ${question}`;

  return { system, user };
}

export function evaluationPrompt(
  question: string,
  type: QuestionType,
  difficulty: Difficulty,
  answer: string,
  answerMode: string
): { system: string; user: string } {
  const starInstruction =
    type === "behavioral"
      ? `\nSince this is a behavioral question, evaluate the answer against the STAR framework. For each component (Situation, Task, Action, Result), provide a score from 1 to 5 and a brief comment.

Include a "starEvaluation" field in your JSON response:
"starEvaluation": {
  "situation": {"score": <1-5>, "comment": "..."},
  "task": {"score": <1-5>, "comment": "..."},
  "action": {"score": <1-5>, "comment": "..."},
  "result": {"score": <1-5>, "comment": "..."}
}`
      : "";

  const system = `You are an expert interview coach evaluating a candidate's answer. Be constructive, specific, and actionable. Rate honestly but encouragingly. Consider the difficulty level when calibrating your expectations.${starInstruction}

Respond in this exact JSON format and nothing else:
{
  "overallAssessment": "<2-3 sentence summary of the answer quality>",
  "strengths": ["<specific strength 1>", "<specific strength 2>"],
  "improvements": ["<specific area for improvement 1>", "<specific area for improvement 2>"]${type === "behavioral" ? ',\n  "starEvaluation": { ... }' : ""}
}`;

  const user = `Question (${type}, ${difficulty}): ${question}

Candidate's Answer (${answerMode}): ${answer}`;

  return { system, user };
}
