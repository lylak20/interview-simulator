import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getAnthropicClient } from "@/lib/anthropic";
import { buildQuestionPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { GenerateQuestionSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateQuestionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { type, difficulty, jobDescription } = parsed.data;
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildQuestionPrompt(type, difficulty, jobDescription),
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    const questionData = JSON.parse(rawText);
    const question = {
      id: uuidv4(),
      type,
      difficulty,
      ...questionData,
    };

    return NextResponse.json(question);
  } catch (err) {
    console.error("[generate-question]", err);
    return NextResponse.json(
      { error: "Failed to generate question. Please try again." },
      { status: 500 }
    );
  }
}
