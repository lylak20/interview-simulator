import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { questionGenerationPrompt } from "@/lib/prompts";
import { QuestionType, Difficulty } from "@/lib/types";

const VALID_TYPES: QuestionType[] = ["behavioral", "case", "situational"];
const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, difficulty, jobDescription } = body;

    if (!VALID_TYPES.includes(type) || !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid type or difficulty" },
        { status: 400 }
      );
    }

    const { system, user } = questionGenerationPrompt(
      type,
      difficulty,
      jobDescription
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      system,
      messages: [{ role: "user", content: user }],
    });

    const question =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    return NextResponse.json({ question, type, difficulty });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
