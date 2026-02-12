// src/app/api/ai/assistant/route.ts
// Global assistant endpoint — general AI assistant for the platform

import { NextRequest, NextResponse } from "next/server";
import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI — the intelligent assistant for the Masidy platform, a full-stack SaaS builder.

You help users with:
- Answering questions about web development, cloud hosting, domains, billing
- Suggesting features and project structures  
- Explaining platform modules and how to use them
- Guiding users through setup, deployment, and best practices
- Generating project structures and architecture recommendations

Masidy platform modules include:
- AI IDE: Full cloud code editor with AI assistance
- UI Builder: Drag-and-drop interface builder
- Workflow Automation: Visual workflow builder
- Cloud Hosting: Deploy to multiple cloud providers
- Database Management: Visual DB management with migrations
- Domain Management: Register and configure domains
- Billing: Subscription management with Stripe

Be helpful, concise, and practical. Use markdown formatting.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode } = (await req.json()) as {
      prompt: string;
      mode?: "answer" | "suggest" | "structure" | "explain" | "guide" | "onboarding";
    };

    if (!prompt) {
      return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
    }

    let userMessage: string;

    switch (mode) {
      case "suggest":
        userMessage = `Suggest features or improvements for: ${prompt}`;
        break;
      case "structure":
        userMessage = `Generate a full project file/folder structure for: ${prompt}\n\nOutput as a tree structure with brief descriptions.`;
        break;
      case "explain":
        userMessage = `Explain this Masidy platform module or concept: ${prompt}`;
        break;
      case "guide":
        userMessage = `Guide the user through: ${prompt}\n\nProvide step-by-step instructions.`;
        break;
      case "onboarding":
        userMessage = `Help this user get started with Masidy. Their question: ${prompt}\n\nProvide a friendly, step-by-step onboarding answer.`;
        break;
      default:
        userMessage = prompt;
    }

    const result = await askClaude(SYSTEM_PROMPT, userMessage, {
      maxTokens: 4096,
    });

    return NextResponse.json({ response: result });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
