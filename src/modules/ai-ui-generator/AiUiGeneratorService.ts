// src/modules/ai-ui-generator/AiUiGeneratorService.ts
// Wired to Anthropic Claude via /api/ai/generate-ui

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a UI code generator. Generate React + TypeScript + Tailwind CSS components. Output ONLY the code. Use semantic HTML, accessibility best practices, responsive design, and dark mode support.`;

export class AiUiGeneratorService {
  async generateUi(prompt: string): Promise<string> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Generate a UI component: ${prompt}`,
      { maxTokens: 8192 }
    );
    return result;
  }
}
