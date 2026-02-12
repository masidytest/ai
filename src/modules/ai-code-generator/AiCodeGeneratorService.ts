// src/modules/ai-code-generator/AiCodeGeneratorService.ts
// Wired to Anthropic Claude via /api/ai/generate-code

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a code generator. Output ONLY the requested code inside a code block. Use modern best practices. Default to TypeScript if no language is specified.`;

export class AiCodeGeneratorService {
  async generateCode(prompt: string): Promise<string> {
    const result = await askClaude(SYSTEM_PROMPT, prompt, { maxTokens: 8192 });
    return result;
  }
}
