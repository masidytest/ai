// backend/src/modules/ai-ide/aiIde.service.ts
// Wired to Anthropic Claude — backend AI IDE service

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");
  return new Anthropic({ apiKey });
}

async function ask(system: string, userMessage: string, maxTokens = 4096): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    temperature: 0.3,
    system,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text ?? "";
}

export class AiIdeService {
  static async generateCode(prompt: string): Promise<string> {
    return ask(
      "You are an expert code generator. Output ONLY the requested code. Use modern best practices. Default to TypeScript.",
      prompt,
      8192
    );
  }

  static async refactorCode(code: string, instruction: string): Promise<string> {
    return ask(
      "You are a code refactoring expert. Output ONLY the improved code. Preserve functionality. Follow SOLID principles.",
      `Refactor this code: ${instruction}\n\n\`\`\`\n${code}\n\`\`\``,
      8192
    );
  }

  static async explainCode(code: string): Promise<string> {
    return ask(
      "You are a code explanation expert. Explain code clearly and concisely. Use markdown.",
      `Explain this code:\n\n\`\`\`\n${code}\n\`\`\``,
      4096
    );
  }
}
