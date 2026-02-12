// src/modules/workflow/TriggerGenerator.ts
// Utility for generating workflow triggers from prompt

export type WorkflowTrigger = {
  type: string;
  config: Record<string, any>;
};

export class TriggerGenerator {
  /**
   * Generate a webhook trigger from prompt
   */
  static generateWebhookTrigger(prompt: string): WorkflowTrigger {
    // Simple heuristic: look for webhook keywords
    return {
      type: "webhook",
      config: {
        url: "https://example.com/webhook",
        method: /post|create/i.test(prompt) ? "POST" : "GET",
        headers: {},
      },
    };
  }

  /**
   * Generate a cron/schedule trigger from prompt
   */
  static generateCronTrigger(prompt: string): WorkflowTrigger {
    // Look for time/frequency keywords
    let cron = "0 0 * * *"; // default: daily
    if (/hourly/i.test(prompt)) cron = "0 * * * *";
    if (/weekly/i.test(prompt)) cron = "0 0 * * 0";
    if (/monthly/i.test(prompt)) cron = "0 0 1 * *";
    return {
      type: "cron",
      config: {
        cron,
        timezone: "UTC",
      },
    };
  }

  /**
   * Generate an event trigger from prompt
   */
  static generateEventTrigger(prompt: string): WorkflowTrigger {
    // Look for event keywords
    let event = "generic_event";
    if (/signup|register/i.test(prompt)) event = "user_signup";
    if (/login|signin/i.test(prompt)) event = "user_login";
    if (/payment|purchase/i.test(prompt)) event = "payment_success";
    return {
      type: "event",
      config: {
        event,
      },
    };
  }
}
