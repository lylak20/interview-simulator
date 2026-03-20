import type { Question, QuestionType, Difficulty, ChoiceOption, AnswerMode } from "@/types";

export const SYSTEM_PROMPT = `You are an expert interview coach specializing in venture capital and growth equity careers.

The candidate is an MBA student graduating June 2026, targeting late-stage VC and growth equity associate roles at firms like General Atlantic, Insight Partners, TA Associates, Summit Partners, TCV, and Warburg Pincus.

Your coaching is rigorous, precise, and finance-literate. You deeply understand:
- SaaS and growth metrics: ARR, MRR, NRR, Logo Retention, CAC, LTV, CAC Payback Period, Sales Magic Number, Rule of 40, Quick Ratio, Gross Margin, Burn Multiple
- Investment frameworks: TAM/SAM/SOM, portfolio company evaluation, founder assessment, investment thesis construction
- Growth equity deal dynamics: due diligence processes, IC presentations, minority vs. control investing, growth vs. profitability tradeoffs

You do NOT give generic MBA-speak. Every piece of feedback is specific, actionable, and grounded in what VC/growth equity investors actually evaluate.

Always return valid JSON with no markdown, no code fences, no commentary outside the JSON object.`;

// ─── Question Generation ──────────────────────────────────────────────────────

const difficultyContext: Record<Difficulty, string> = {
  easy: "entry-level analyst level (knows definitions and formulas, can do basic calculations)",
  medium: "associate level (can calculate, interpret trends, and identify anomalies in context)",
  hard: "VP or principal level (diagnose complex situations, compare across companies, construct investment thesis implications)",
};

const metricsPromptBody = (difficulty: Difficulty, jd?: string) => `
Generate a metrics or technical interview question for a VC/growth equity interview.

The question should test knowledge and analytical interpretation of SaaS/growth metrics such as:
ARR, MRR, NRR (Net Revenue Retention), Logo Retention, CAC (Customer Acquisition Cost),
LTV (Lifetime Value), CAC Payback Period, Sales Magic Number, Rule of 40,
Quick Ratio, Gross Margin, Burn Multiple, or combinations thereof.

Difficulty target: ${difficultyContext[difficulty]}
- Easy: Ask about definition, formula, or a straightforward calculation
- Medium: Give a scenario with numbers, ask them to calculate AND interpret what it signals to a growth equity investor
- Hard: Present an anomaly or apparent contradiction in metrics and ask them to diagnose it, or compare two companies and recommend which is a better investment and why
${jd ? `\nJob context (tailor the question to this role):\n${jd.slice(0, 800)}` : "\nContext: Growth equity or late-stage VC fund role"}

Return ONLY valid JSON, no markdown, no code fences:
{
  "text": "<the interview question — be specific, include real numbers for medium/hard>",
  "context": "<optional 1-2 sentence setup scenario, or empty string>",
  "hints": ["<optional hint 1 about what to cover>", "<optional hint 2>"],
  "metricFocus": "<primary metric(s) being tested, e.g. 'Rule of 40' or 'NRR + CAC Payback'>"
}`;

const behavioralPromptBody = (difficulty: Difficulty, jd?: string) => `
Generate a behavioral interview question (STAR format) for a VC/growth equity interview.

Focus on scenarios realistic in VC/PE work: investment committee dynamics, due diligence conflicts,
influencing without authority, leading under ambiguity, managing up, cross-functional collaboration
on portfolio companies, or high-stakes decision making with incomplete information.

Difficulty target: ${difficultyContext[difficulty]}
- Easy: Clear scenario with obvious path forward
- Medium: Some ambiguity, requires balancing competing priorities
- Hard: High stakes, significant ambiguity, tests judgment and leadership under pressure
${jd ? `\nJob context:\n${jd.slice(0, 800)}` : ""}

Return ONLY valid JSON, no markdown:
{
  "text": "<the behavioral question>",
  "context": "",
  "hints": ["Think about the Situation and Task first", "What specific Actions did YOU take?", "What was the measurable Result?"]
}`;

const situationalPromptBody = (difficulty: Difficulty, jd?: string) => `
Generate a situational judgment question for a VC/growth equity interview.

Present a concrete investment or professional dilemma (2-3 sentence scenario) and ask what they would do.
Examples of good scenarios: metric inconsistency found late in diligence, founder misrepresenting something,
disagreement with a senior partner on a deal, a portfolio company missing its plan,
pressure to close a deal you have concerns about.

Difficulty target: ${difficultyContext[difficulty]}
${jd ? `\nJob context:\n${jd.slice(0, 800)}` : ""}

Return ONLY valid JSON, no markdown:
{
  "text": "<what would you do in this situation?>",
  "context": "<2-3 sentence scenario setup — make it vivid and specific>",
  "hints": ["Consider the stakeholders involved", "Think about short-term vs. long-term implications"]
}`;

export function buildQuestionPrompt(
  type: QuestionType,
  difficulty: Difficulty,
  jobDescription?: string
): string {
  switch (type) {
    case "metrics":
      return metricsPromptBody(difficulty, jobDescription);
    case "behavioral":
      return behavioralPromptBody(difficulty, jobDescription);
    case "situational":
      return situationalPromptBody(difficulty, jobDescription);
  }
}

// ─── Multiple Choice Generation ───────────────────────────────────────────────

export function buildChoicesPrompt(question: Question, jobDescription?: string): string {
  const isMetrics = question.type === "metrics";
  return `Given this interview question:
"${question.text}"
${question.context ? `\nScenario: ${question.context}` : ""}

Generate exactly 4 multiple-choice answer options.
${isMetrics ? `
For metrics questions:
A) Correct formula/calculation + strong investor interpretation + ties to investment thesis
B) Correct formula but shallow or incomplete interpretation
C) Formula has a minor error or interpretation misses the investment implication
D) Incorrect formula or fundamental misunderstanding of the metric
` : `
For behavioral/situational questions:
A) Strong, complete answer demonstrating excellent judgment and VC/PE acumen
B) Good answer with one notable gap or missed point
C) Mediocre — correct intent but too vague, generic, or lacking analytical depth
D) Weak — common mistake, overly generic, or demonstrates poor judgment
`}
For each option, write a 1-sentence rationale explaining why it is strong or weak.
${jobDescription ? `\nRole context: ${jobDescription.slice(0, 400)}` : ""}

Return ONLY a valid JSON array, no markdown:
[
  {"id": "A", "label": "<full answer text, 2-4 sentences>", "rationale": "<why this is strong/weak>"},
  {"id": "B", "label": "<full answer text>", "rationale": "<why>"},
  {"id": "C", "label": "<full answer text>", "rationale": "<why>"},
  {"id": "D", "label": "<full answer text>", "rationale": "<why>"}
]`;
}

// ─── Answer Analysis + Feedback ───────────────────────────────────────────────

export function buildFeedbackPrompt(params: {
  question: Question;
  answerMode: AnswerMode;
  freeformText?: string;
  chosenOption?: ChoiceOption;
  jobDescription?: string;
}): string {
  const { question, answerMode, freeformText, chosenOption, jobDescription } = params;

  const answerText =
    answerMode === "freeform"
      ? freeformText
      : `[Multiple choice selected — Option ${chosenOption?.id}] ${chosenOption?.label}`;

  const isMetrics = question.type === "metrics";
  const isBehavioral = question.type === "behavioral";

  const typeSpecificInstruction = isMetrics
    ? `This is a metrics/technical question. Include a "metricAccuracy" object assessing:
- formulaCorrect: boolean — did they use the correct formula?
- interpretationQuality: "excellent" | "good" | "partial" | "poor" — how well did they interpret the number in context?
- investmentContextualized: boolean — did they connect the metric to what it means for an investment thesis or decision?
- details: string — 2-3 sentences of specific technical feedback on their metric knowledge
Do NOT include "starBreakdown".`
    : isBehavioral
    ? `This is a behavioral question. Include "starBreakdown" evaluating each STAR component.
Do NOT include "metricAccuracy".`
    : `This is a situational judgment question. Omit both "starBreakdown" and "metricAccuracy".`;

  return `Evaluate this interview answer. Be specific, honest, and constructive.
Do not give generic praise — this candidate is preparing for VC/growth equity roles at top firms.

Question: "${question.text}"
${question.context ? `Scenario: ${question.context}` : ""}
Question type: ${question.type}
Difficulty: ${question.difficulty}
${question.metricFocus ? `Metric focus: ${question.metricFocus}` : ""}
${jobDescription ? `Role context: ${jobDescription.slice(0, 400)}` : ""}

Candidate's answer:
"""
${answerText}
"""

${typeSpecificInstruction}

Return ONLY valid JSON in exactly this shape (omit fields noted above based on question type):
{
  "overallScore": <integer 1-10>,
  "summary": "<2-3 sentence executive summary — be direct about overall quality>",
  "strengths": ["<specific strength with context>", "<another strength>"],
  "improvements": ["<specific gap or weak point>", "<another improvement>"],
  "missedPoints": ["<key point they should have made but didn't>"],
  "starBreakdown": [
    {"component": "Situation", "score": <1-5>, "comment": "<specific feedback>"},
    {"component": "Task", "score": <1-5>, "comment": "<specific feedback>"},
    {"component": "Action", "score": <1-5>, "comment": "<specific feedback>"},
    {"component": "Result", "score": <1-5>, "comment": "<specific feedback>"}
  ],
  "metricAccuracy": {
    "formulaCorrect": <boolean>,
    "interpretationQuality": "<excellent|good|partial|poor>",
    "investmentContextualized": <boolean>,
    "details": "<2-3 sentences of specific technical feedback>"
  },
  "exampleResponse": "<A 2-3 sentence model answer or the key phrase/framework they should have used>"
}`;
}
