// src/app/api/ai/generate-code/route.ts
// Code generation endpoint — returns generated code from Claude

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Code Generator — an expert at generating clean, production-ready code.

Rules:
- Output ONLY the code requested, inside a single code block
- Use modern best practices for the specified language
- Include proper types (TypeScript), error handling, and comments where helpful
- If generating multiple files, separate each with a header comment showing the filepath
- No explanatory text before or after the code unless specifically asked
- Default to TypeScript/React if no language is specified`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, language, context, mode } = (await req.json()) as {
      prompt: string;
      language?: string;
      context?: string; // existing code / project files
      mode?: "generate" | "file" | "multi-file" | "continue" | "tests";
    };

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let userMessage = prompt;

    if (language) {
      userMessage = `Language: ${language}\n\n${userMessage}`;
    }
    if (context) {
      userMessage = `Existing code context:\n\`\`\`\n${context}\n\`\`\`\n\n${userMessage}`;
    }

    switch (mode) {
      case "continue":
        userMessage = `Continue this code naturally. Output only the continuation (no duplicating existing code):\n\n${userMessage}`;
        break;
      case "tests":
        userMessage = `Generate comprehensive unit tests for this code. Use the appropriate testing framework (Jest/Vitest for TS/JS, pytest for Python, etc.):\n\n${userMessage}`;
        break;
      case "multi-file":
        userMessage = `Generate a complete multi-file project structure for:\n\n${userMessage}\n\nOutput each file with its filepath as a header comment.`;
        break;
      case "file":
        userMessage = `Generate a single file for:\n\n${userMessage}`;
        break;
      default:
        break;
    }

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      maxTokens: 8192,
    });

    return NextResponse.json({ code: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
