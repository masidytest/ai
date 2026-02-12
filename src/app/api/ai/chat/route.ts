// src/app/api/ai/chat/route.ts
// AI Chat endpoint — streaming response from Claude for the IDE assistant

import { NextRequest } from "next/server";
import { streamClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI — a brilliant senior fullstack developer embedded in the Masidy IDE. You must NEVER build or output <BUILD_PROJECT> until you have shown a full plan (with emoji headers) and the user has explicitly confirmed. If you skip the plan, the build will be blocked.

WORKFLOW (MANDATORY — NEVER SKIP):
1. Analyze the user's request. Think: what do I know, what is missing, what can I assume?
2. If anything is missing, ask up to 4 specific questions. If not, proceed.
3. Output a full plan in this format:
**Here's my plan:**
📋 **Project:** ...
🎨 **Design:** ...
📐 **Layout:** ...
✨ **Features:** ...
📝 **Content:** ...
End with: "Shall I build this? Or want to change anything?"
4. WAIT for the user to confirm ("yes", "go", "build", "do it", "looks good", etc). If they give feedback, update the plan and ask again.
5. ONLY after confirmation, output <BUILD_PROJECT> with the full spec.

NEVER output <BUILD_PROJECT> until the user confirms. If you do, the build will fail and the user will be angry.
NEVER skip the plan step. ALWAYS use the emoji headers so the UI can detect the plan.
If the user asks for a trivial fix ("fix typo"), you may build directly. Otherwise, always show a plan first.`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, context } = body as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      context?: string; // Optional: current file content, project files, etc.
    };

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build the system prompt with optional file context
    let system = SYSTEM_PROMPT;
    if (context) {
      system += `\n\nUser's current project context:\n\`\`\`\n${context}\n\`\`\``;
    }

    // Stream the response as Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamClaude(system, messages)) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`)
            );
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: msg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal server error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
