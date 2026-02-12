// src/modules/ai-global-assistant/AiGlobalAssistantService.ts
// Wired to Anthropic Claude — general platform assistant

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI — the intelligent assistant for the Masidy platform (a full-stack SaaS builder). You help with web development, cloud hosting, domains, billing, project architecture, and platform guidance. Be helpful, concise, and practical. Use markdown.`;

export class AiGlobalAssistantService {
  async answerQuestion(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, prompt);
  }

  async suggestFeature(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, `Suggest features or improvements for: ${prompt}`);
  }

  async generateProjectStructure(prompt: string): Promise<string> {
    return askClaude(
      SYSTEM_PROMPT,
      `Generate a full project file/folder structure for: ${prompt}\n\nOutput as a tree structure with brief descriptions.`
    );
  }

  async explainPlatformModule(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, `Explain this Masidy platform module or concept: ${prompt}`);
  }

  async guideUser(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, `Guide the user through: ${prompt}\n\nProvide step-by-step instructions.`);
  }
}
