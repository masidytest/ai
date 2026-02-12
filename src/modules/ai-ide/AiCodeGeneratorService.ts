// src/modules/ai-ide/AiCodeGeneratorService.ts
// Wired to Anthropic Claude — code generation for the IDE

import { askClaude } from "@/lib/anthropic";

export interface ProjectContext {
  files: Array<{ path: string; content: string }>;
  language: string;
  mainFile?: string;
}

const SYSTEM_PROMPT = `You are an expert code generator inside the Masidy IDE. Output clean, production-ready code. Use modern best practices for the specified language. Include proper types, error handling, and helpful comments.`;

function buildContextString(context: ProjectContext): string {
  const fileList = context.files
    .map((f) => `// ${f.path}\n${f.content}`)
    .join("\n\n");
  return `Language: ${context.language}\nMain file: ${context.mainFile ?? "N/A"}\n\nExisting project files:\n${fileList}`;
}

export class AiCodeGeneratorService {
  static async generateCode(prompt: string, context: ProjectContext): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `${buildContextString(context)}\n\nGenerate code for: ${prompt}`,
      { maxTokens: 8192 }
    );
    return { code: result };
  }

  static async generateFile(prompt: string, context: ProjectContext): Promise<{ path: string; content: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `${buildContextString(context)}\n\nGenerate a single file for: ${prompt}\n\nOutput the filepath as a comment on line 1, then the code.`,
      { maxTokens: 8192 }
    );
    // Parse filepath from first line comment
    const lines = result.split("\n");
    const pathMatch = lines[0]?.match(/\/\/\s*(.+)/);
    const path = pathMatch?.[1]?.trim() || `src/generated/${Date.now()}.ts`;
    const content = lines.slice(1).join("\n").trim();
    return { path, content };
  }

  static async generateMultipleFiles(prompt: string, context: ProjectContext): Promise<{ files: Array<{ path: string; content: string }> }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `${buildContextString(context)}\n\nGenerate a complete multi-file project for: ${prompt}\n\nOutput each file with its filepath as a header comment (// filepath: <path>), separated by blank lines.`,
      { maxTokens: 8192 }
    );
    // Parse multiple files from output
    const blocks = result.split(/\/\/\s*filepath:\s*/i).filter(Boolean);
    const files = blocks.map((block) => {
      const lines = block.split("\n");
      const path = lines[0]?.trim() || `src/generated/${Date.now()}.ts`;
      const content = lines.slice(1).join("\n").trim();
      return { path, content };
    });
    return { files: files.length > 0 ? files : [{ path: "src/generated/output.ts", content: result }] };
  }

  static async continueCode(code: string, context: ProjectContext): Promise<{ code: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `${buildContextString(context)}\n\nContinue this code naturally. Output only the continuation (don't repeat existing code):\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 4096 }
    );
    return { code: result };
  }

  static async generateTests(code: string, context: ProjectContext): Promise<{ tests: string }> {
    const result = await askClaude(
      SYSTEM_PROMPT,
      `${buildContextString(context)}\n\nGenerate comprehensive unit tests for this code. Use the appropriate testing framework:\n\n\`\`\`\n${code}\n\`\`\``,
      { maxTokens: 8192 }
    );
    return { tests: result };
  }
}
