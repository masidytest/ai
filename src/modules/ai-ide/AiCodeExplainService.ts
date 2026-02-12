// src/modules/ai-ide/AiCodeExplainService.ts
// Wired to Anthropic Claude — code explanation

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a code explanation expert. Explain code in clear, beginner-friendly language. Break down complex logic step by step. Highlight important patterns and potential issues. Use markdown with headers and bullet points.`;

export class AiCodeExplainService {
  static async explainCode(code: string): Promise<{ explanation: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Explain this code clearly:\n\n\`\`\`\n${code}\n\`\`\``,
      { temperature: 0.2 }
    );
    return { explanation: result };
  }

  static async explainFunction(code: string, functionName: string): Promise<{ explanation: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Explain what the function "${functionName}" does in this code:\n\n\`\`\`\n${code}\n\`\`\``,
      { temperature: 0.2 }
    );
    return { explanation: result };
  }

  static async explainFileStructure(code: string): Promise<{ structure: string[] }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `List the structure sections of this file. Output each section on its own line with a brief description:\n\n\`\`\`\n${code}\n\`\`\``,
      { temperature: 0.2 }
    );
    const structure = result.split("\n").filter((line) => line.trim().length > 0);
    return { structure };
  }

  static async explainErrors(code: string): Promise<{ errors: string[] }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Analyze this code for bugs based on the code. List each problem on its own line with line reference and fix suggestion:\n\n\`\`\`\n${code}\n\`\`\``,
      { temperature: 0.2 }
    );
    const errors = result.split("\n").filter((line) => line.trim().length > 0);
    return { errors };
  }
}
