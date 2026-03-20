import { NextRequest, NextResponse } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { buildChoicesPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { GenerateChoicesSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = GenerateChoicesSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.message }, { status: 400 });
    }

    const { question, jobDescription } = parsed.data;
    const client = getAnthropicClient();

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildChoicesPrompt(question, jobDescription),
        },
      ],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text.trim() : "[]";

    const choices = JSON.parse(rawText);
    return NextResponse.json(choices);
  } catch (err) {
    console.error("[generate-choices]", err);
    return NextResponse.json(
      { error: "Failed to generate choices. Please try again." },
      { status: 500 }
    );
  }
}
