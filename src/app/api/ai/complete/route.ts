// src/app/api/ai/complete/route.ts
// Code completion endpoint — for inline suggestions

import { NextRequest, NextResponse } from "next/server";
import { askClaude, FAST_MODEL } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Code Completion engine.

Rules:
- Output ONLY the completion text — no explanation, no code fences, no markdown
- Complete the code naturally based on context
- Match the existing code style, indentation, and patterns
- Be concise — complete the current logical unit (line, function, block)
- If suggesting imports, list only the most relevant ones`;

export async function POST(req: NextRequest) {
  try {
    const { code, cursorPosition, mode } = (await req.json()) as {
      code: string;
      cursorPosition?: number;
      mode?: "line" | "function" | "imports";
    };

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let userMessage: string;

    switch (mode) {
      case "function":
        userMessage = `Suggest the next function that should be added to this code. Output only the function code:\n\n${code}`;
        break;
      case "imports":
        userMessage = `Suggest the missing imports for this code. Output only import statements, one per line:\n\n${code}`;
        break;
      default: {
        // Line completion — split at cursor and complete from there
        const before = cursorPosition ? code.slice(0, cursorPosition) : code;
        userMessage = `Complete this code from where it ends. Output only the continuation:\n\n${before}`;
        break;
      }
    }

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      model: FAST_MODEL,
      maxTokens: 1024,
      temperature: 0.1,
    });

    return NextResponse.json({ completion: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
