// src/app/api/ai/refactor/route.ts
// Code refactoring endpoint

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Code Refactoring assistant — an expert at improving code quality.

Rules:
- Output ONLY the improved code in a code block
- Preserve the code's functionality exactly
- Apply the specific refactoring requested (readability, performance, TypeScript conversion, etc.)
- Add brief inline comments explaining significant changes
- Follow SOLID principles and clean code practices
- Do not add unnecessary abstractions`;

export async function POST(req: NextRequest) {
  try {
    const { code, instructions, mode } = (await req.json()) as {
      code: string;
      instructions?: string;
      mode?: "refactor" | "readability" | "performance" | "typescript" | "extract";
    };

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let userMessage: string;

    switch (mode) {
      case "readability":
        userMessage = `Improve the readability of this code. Better variable names, clearer structure, add comments:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "performance":
        userMessage = `Optimize this code for performance. Reduce complexity, minimize allocations, improve algorithms:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "typescript":
        userMessage = `Convert this code to TypeScript with full type annotations, interfaces, and proper types:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "extract":
        userMessage = `Extract reusable components/functions from this code. Output each component separately with filepath comments:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      default:
        userMessage = `Refactor this code${instructions ? ` with these instructions: ${instructions}` : ""}:\n\n\`\`\`\n${code}\n\`\`\``;
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
