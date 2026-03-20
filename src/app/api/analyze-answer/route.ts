import { NextRequest } from "next/server";
import { getAnthropicClient } from "@/lib/anthropic";
import { buildFeedbackPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { AnalyzeAnswerSchema } from "@/lib/validators";

// Allow up to 30s on Vercel Pro; Hobby plan is capped at 10s
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = AnalyzeAnswerSchema.safeParse(body);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = getAnthropicClient();

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildFeedbackPrompt(parsed.data),
        },
      ],
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(chunk.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("[analyze-answer]", err);
    return new Response(
      JSON.stringify({ error: "Failed to analyze answer. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
