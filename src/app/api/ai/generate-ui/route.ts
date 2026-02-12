// src/app/api/ai/generate-ui/route.ts
// UI generation endpoint — generates React/HTML UI components from prompts

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI UI Generator — an expert at generating beautiful, responsive UI components.

Rules:
- Generate React + TypeScript + Tailwind CSS components by default
- Output clean, modern, production-quality UI code
- Use semantic HTML and accessibility best practices (aria labels, roles, etc.)
- Include responsive design (mobile-first approach)
- Use Tailwind CSS classes for all styling
- Add smooth transitions and hover states where appropriate
- Include dark mode support using Tailwind dark: prefix
- Output ONLY the code — no explanatory text unless asked
- If generating a full page, include a default export
- Use modern React patterns: functional components, hooks, TypeScript interfaces`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, framework, style } = (await req.json()) as {
      prompt: string;
      framework?: string; // "react" | "html" | "vue" | "svelte"
      style?: string; // "tailwind" | "css" | "styled-components"
    };

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let userMessage = `Generate a UI component: ${prompt}`;

    if (framework && framework !== "react") {
      userMessage += `\n\nFramework: ${framework}`;
    }
    if (style && style !== "tailwind") {
      userMessage += `\nStyling: ${style}`;
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
