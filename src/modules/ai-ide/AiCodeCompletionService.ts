// src/modules/ai-ide/AiCodeCompletionService.ts
// Wired to Anthropic Claude — inline code completion

import { askClaude, FAST_MODEL } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are a code completion engine. Output ONLY the completion text — no explanation, no code fences, no markdown. Complete the code naturally based on context. Match the existing style and indentation.`;

export class AiCodeCompletionService {
  static async completeLine(code: string, cursorPosition: number): Promise<{ completion: string }> {
    const before = code.slice(0, cursorPosition);
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Complete this code from where it ends. Output only the continuation:\n\n${before}`,
      { model: FAST_MODEL, maxTokens: 512, temperature: 0.1 }
    );
    return { completion: result };
  }

  static async suggestNextFunction(code: string): Promise<{ suggestion: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `Suggest the next function that should be added to this code. Output only the function code:\n\n${code}`,
      { model: FAST_MODEL, maxTokens: 1024, temperature: 0.2 }
    );
    return { suggestion: result };
  }

  static async suggestImports(code: string): Promise<{ imports: string[] }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `List missing imports for this code. Output one import statement per line, nothing else:\n\n${code}`,
      { model: FAST_MODEL, maxTokens: 512, temperature: 0.1 }
    );
    const imports = result.split("\n").filter((line) => line.trim().startsWith("import"));
    return { imports };
  }
}
