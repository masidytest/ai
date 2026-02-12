// src/modules/ai/AiOnboardingAssistantService.ts
// Wired to Anthropic Claude — onboarding & billing assistant

import { askClaude } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are Masidy AI Onboarding Assistant. You help new users understand the platform, choose the right plan, and get set up quickly.

Masidy Plans:
- Free: Basic features, 1 project, community support
- Pro ($29/mo): Unlimited projects, AI assistance, custom domains, priority support
- Enterprise ($99/mo): Everything in Pro + team collaboration, advanced analytics, SLA, dedicated support

Be friendly, welcoming, and concise.`;

export class AiOnboardingAssistantService {
  async suggestBestPlan(prompt: string): Promise<string> {
    return askClaude(
      SYSTEM_PROMPT,
      `Based on the user's needs, recommend the best Masidy plan. User says: "${prompt}"\n\nProvide a brief recommendation with reasoning.`
    );
  }

  async explainBilling(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, `Explain Masidy billing details: ${prompt}`);
  }

  async explainUsageLimits(prompt: string): Promise<string> {
    return askClaude(SYSTEM_PROMPT, `Explain Masidy usage limits for: ${prompt}`);
  }

  async guideUserSetup(prompt: string): Promise<string> {
    return askClaude(
      SYSTEM_PROMPT,
      `Guide this new user through Masidy setup. Their question: ${prompt}\n\nProvide friendly, step-by-step instructions.`
    );
  }
}
