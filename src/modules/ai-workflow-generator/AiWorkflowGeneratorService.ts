// src/modules/ai-workflow-generator/AiWorkflowGeneratorService.ts
// Wired to Anthropic Claude via /api/ai/generate-workflow

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are an automation workflow generator. Generate workflow definitions as structured JSON with: name, description, triggers, steps (each with id, type, action, parameters), and conditions. Output valid JSON in a code block.`;

export class AiWorkflowGeneratorService {
  async generateWorkflow(prompt: string): Promise<string> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Generate an automation workflow for: ${prompt}\n\nOutput as a JSON workflow definition.`,
      { maxTokens: 4096 }
    );
    return result;
  }
}
