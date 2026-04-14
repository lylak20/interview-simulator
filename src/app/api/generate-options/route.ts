import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";
import { optionsGenerationPrompt } from "@/lib/prompts";
import { QuestionType, Difficulty } from "@/lib/types";

function parseJSON(text: string) {
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, type, difficulty } = body;

    if (!question || !type || !difficulty) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { system, user } = optionsGenerationPrompt(
      question,
      type as QuestionType,
      difficulty as Difficulty
    );

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = parseJSON(text);

    return NextResponse.json({ options: parsed.options });
  } catch (error) {
    console.error("Error generating options:", error);
    return NextResponse.json(
      { error: "Failed to generate options" },
      { status: 500 }
    );
  }
}
