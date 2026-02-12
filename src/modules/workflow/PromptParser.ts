// src/modules/workflow/PromptParser.ts
// Utility for extracting workflow structure from natural language prompts

export class PromptParser {
  /**
   * Extract the main trigger/intent from the prompt
   */
  static extractTriggerIntent(prompt: string): string {
    if (/signup|register/i.test(prompt)) return "user_signup";
    if (/login|signin/i.test(prompt)) return "user_login";
    if (/payment|purchase/i.test(prompt)) return "payment_success";
    if (/error|fail/i.test(prompt)) return "error_event";
    return "generic_event";
  }

  /**
   * Extract actions to perform from the prompt
   */
  static extractActions(prompt: string): string[] {
    const actions: string[] = [];
    if (/email|notify/i.test(prompt)) actions.push("send_email");
    if (/crm|customer/i.test(prompt)) actions.push("add_to_crm");
    if (/log|record/i.test(prompt)) actions.push("log_event");
    if (/webhook/i.test(prompt)) actions.push("call_webhook");
    return actions.length ? actions : ["log_event"];
  }

  /**
   * Extract data sources mentioned in the prompt
   */
  static extractDataSources(prompt: string): string[] {
    const sources: string[] = [];
    if (/database|db/i.test(prompt)) sources.push("database");
    if (/api|external/i.test(prompt)) sources.push("external_api");
    if (/spreadsheet|sheet/i.test(prompt)) sources.push("spreadsheet");
    if (/crm/i.test(prompt)) sources.push("crm");
    return sources;
  }

  /**
   * Extract conditions from the prompt
   */
  static extractConditions(prompt: string): string[] {
    const conditions: string[] = [];
    if (/plan|upgrade/i.test(prompt)) conditions.push("plan_check");
    if (/if|when|unless|only if/i.test(prompt)) conditions.push("custom_condition");
    if (/amount|greater|less/i.test(prompt)) conditions.push("amount_check");
    return conditions;
  }

  /**
   * Extract execution order hints from the prompt
   */
  static extractExecutionOrder(prompt: string): string[] {
    // Simple heuristic: order by appearance of keywords
    const order: string[] = [];
    const map = [
      { re: /trigger|when|on/i, val: "trigger" },
      { re: /condition|if|check/i, val: "condition" },
      { re: /action|then|do|send|add|call|log/i, val: "action" },
    ];
    map.forEach(({ re, val }) => {
      if (re.test(prompt)) order.push(val);
    });
    return order.length ? order : ["trigger", "action"];
  }
}
