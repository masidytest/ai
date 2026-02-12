// src/app/api/ai/fix/route.ts
// Code fixing endpoint

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Code Fixer — an expert at finding and fixing code issues.

Rules:
- Output ONLY the fixed code in a code block
- Fix all errors while preserving original intent and functionality
- Add a brief comment above each fix explaining what was wrong
- Do not change code that isn't broken
- Fix type errors, syntax errors, logic errors, and import issues`;

export async function POST(req: NextRequest) {
  try {
    const { code, mode } = (await req.json()) as {
      code: string;
      mode?: "all" | "typescript" | "imports" | "syntax";
    };

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let userMessage: string;

    switch (mode) {
      case "typescript":
        userMessage = `Fix all TypeScript type errors in this code. Add missing types, fix type mismatches:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "imports":
        userMessage = `Fix all import/export issues in this code. Add missing imports, remove unused ones, fix paths:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "syntax":
        userMessage = `Fix all syntax errors in this code:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      default:
        userMessage = `Fix all errors and issues in this code:\n\n\`\`\`\n${code}\n\`\`\``;
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
