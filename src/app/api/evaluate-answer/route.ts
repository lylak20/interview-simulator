import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { evaluationPrompt } from "@/lib/prompts";
import { QuestionType, Difficulty } from "@/lib/types";

function parseJSON(text: string) {
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, type, difficulty, answer, answerMode } = body;

    if (!question || !type || !difficulty || !answer || !answerMode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { system, user } = evaluationPrompt(
      question,
      type as QuestionType,
      difficulty as Difficulty,
      answer,
      answerMode
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1200,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = parseJSON(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Error evaluating answer:", error);
    return NextResponse.json(
      { error: "Failed to evaluate answer" },
      { status: 500 }
    );
  }
}
