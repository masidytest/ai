// src/app/api/ai/generate-workflow/route.ts
// Workflow generation endpoint — generates automation workflows from prompts

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Workflow Generator — an expert at designing automation workflows.

Rules:
- Generate workflow definitions as structured JSON
- Each workflow has: name, description, triggers, steps, and conditions
- Each step has: id, type, action, parameters, and optional conditions
- Support common workflow patterns: sequential, parallel, conditional, loops
- Include error handling steps where appropriate
- Output valid JSON wrapped in a code block
- Support integrations: GitHub, Slack, Discord, Email, Webhooks, Database, API calls
- Make workflows practical and production-ready`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, format } = (await req.json()) as {
      prompt: string;
      format?: "json" | "yaml" | "code";
    };

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let userMessage = `Generate an automation workflow for: ${prompt}`;

    if (format === "yaml") {
      userMessage += "\n\nOutput in YAML format.";
    } else if (format === "code") {
      userMessage += "\n\nOutput as executable TypeScript code using async/await.";
    } else {
      userMessage += "\n\nOutput as a JSON workflow definition.";
    }

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      maxTokens: 4096,
    });

    return NextResponse.json({ workflow: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
