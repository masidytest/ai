// src/modules/ai-ide/AiCodeRefactorService.ts
// Wired to Anthropic Claude — code refactoring

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a code refactoring expert. Output ONLY the improved code in a code block. Preserve functionality exactly. Apply the specific refactoring requested. Add brief inline comments for significant changes. Follow SOLID principles.`;

export class AiCodeRefactorService {
  static async refactorCode(code: string, instructions: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Refactor this code with these instructions: ${instructions}\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    return { code: result };
  }

  static async improveReadability(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Improve the readability of this code. Better variable names, clearer structure, add comments:\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    return { code: result };
  }

  static async optimizePerformance(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Optimize this code for performance. Reduce complexity, minimize allocations, improve algorithms:\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    return { code: result };
  }

  static async convertToTypeScript(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Convert this code to TypeScript with full type annotations, interfaces, and proper types:\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    return { code: result };
  }

  static async extractComponents(code: string): Promise<{ components: string[] }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Extract reusable components/functions from this code. Output each component separately, divided by "---COMPONENT---":\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    const components = result.split("---COMPONENT---").map((c) => c.trim()).filter(Boolean);
    return { components: components.length > 0 ? components : [result] };
  }
}
