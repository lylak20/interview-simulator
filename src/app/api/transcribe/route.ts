import { NextResponse } from "next/server";
import anthropic from "@/lib/anthropic";

function parseJSON(text: string) {
  const cleaned = text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
  return JSON.parse(cleaned);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rawTranscript } = body;

    if (!rawTranscript || typeof rawTranscript !== "string") {
      return NextResponse.json(
        { error: "Missing rawTranscript" },
        { status: 400 }
      );
    }

    if (rawTranscript.trim().length === 0) {
      return NextResponse.json(
        { error: "Transcript is empty" },
        { status: 400 }
      );
    }

    // Use Claude to clean up and format the raw speech-recognition transcript.
    // Speech recognition output often lacks punctuation, has filler words, and
    // may have mis-transcribed words. Claude polishes it into readable prose.
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: `You are a transcript editor. You receive raw output from a browser's speech recognition API and clean it up for use as a written interview answer.

Your job:
1. Add correct punctuation and capitalization
2. Remove obvious filler words (um, uh, like, you know) only when they don't affect meaning
3. Fix clear mis-transcriptions based on context (e.g. "four the" → "for the")
4. Preserve the speaker's original meaning and wording as closely as possible — do NOT paraphrase or rewrite
5. Keep all substantive content intact

Respond ONLY with valid JSON in this exact format:
{"transcript": "<cleaned transcript text>"}`,
      messages: [
        {
          role: "user",
          content: `Please clean up this raw speech-recognition transcript:\n\n${rawTranscript}`,
        },
      ],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const parsed = parseJSON(text);

    return NextResponse.json({ transcript: parsed.transcript });
  } catch (error) {
    console.error("Transcription cleanup error:", error);
    return NextResponse.json(
      { error: "Failed to process transcript" },
      { status: 500 }
    );
  }
}
