// src/modules/ai-ide/AiCodeFixService.ts
// Wired to Anthropic Claude — code fixing

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a code fixing expert. Output ONLY the fixed code in a code block. Fix all errors while preserving original intent. Add a brief comment above each fix explaining what was wrong. Do not change code that isn't broken.`;

export class AiCodeFixService {
  static async fixErrors(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Fix all errors and issues in this code:\n\n\`\`\`\n${code}\n\`\`\``
    );
    return { code: result };
  }

  static async fixTypescriptErrors(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Fix all TypeScript type errors in this code. Add missing types, fix type mismatches:\n\n\`\`\`\n${code}\n\`\`\``
    );
    return { code: result };
  }

  static async fixImports(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Fix all import/export issues in this code. Add missing imports, remove unused ones, fix paths:\n\n\`\`\`\n${code}\n\`\`\``
    );
    return { code: result };
  }

  static async fixSyntax(code: string): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Fix all syntax errors in this code:\n\n\`\`\`\n${code}\n\`\`\``
    );
    return { code: result };
  }
}
