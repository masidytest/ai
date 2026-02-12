// src/app/api/ai/explain/route.ts
// Code explanation endpoint

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Code Explainer — an expert at explaining code clearly and concisely.

Rules:
- Explain code in clear, beginner-friendly language
- Break down complex logic step by step
- Highlight important patterns, potential issues, and best practices
- Use markdown formatting with headers and bullet points
- When explaining errors, show what's wrong and how to fix it
- Keep explanations concise but thorough`;

export async function POST(req: NextRequest) {
  try {
    const { code, mode, functionName } = (await req.json()) as {
      code: string;
      mode?: "explain" | "function" | "structure" | "errors";
      functionName?: string;
    };

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    let userMessage: string;

    switch (mode) {
      case "function":
        userMessage = `Explain what the function "${functionName || "main"}" does in this code:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "structure":
        userMessage = `Explain the file structure and organization of this code. List each section, its purpose, and how they connect:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      case "errors":
        userMessage = `Analyze this code for bugs, errors, and potential issues. List each problem with line reference and fix suggestion:\n\n\`\`\`\n${code}\n\`\`\``;
        break;
      default:
        userMessage = `Explain this code clearly:\n\n\`\`\`\n${code}\n\`\`\``;
    }

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      maxTokens: 4096,
      temperature: 0.2,
    });

    return NextResponse.json({ explanation: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
