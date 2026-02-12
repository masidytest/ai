// src/modules/workflow/ParameterGenerator.ts
// Utility for generating parameter configs from prompt context

export class ParameterGenerator {
  /**
   * Generate HTTP request parameters from prompt
   */
  static generateHttpParams(prompt: string) {
    return {
      url: /https?:\/\/[\w.-]+/i.exec(prompt)?.[0] || "https://api.example.com/endpoint",
      method: /post|create/i.test(prompt) ? "POST" : "GET",
      headers: {},
      body: /json|payload|data/i.test(prompt) ? { key: "value" } : undefined,
    };
  }

  /**
   * Generate email parameters from prompt
   */
  static generateEmailParams(prompt: string) {
    return {
      to: /to ([\w.-]+@[\w.-]+)/i.exec(prompt)?.[1] || "user@example.com",
      subject: /subject ([\w\s]+)/i.exec(prompt)?.[1] || "Notification",
      template: /template ([\w-]+)/i.exec(prompt)?.[1] || "default",
      body: /body ([\w\s]+)/i.exec(prompt)?.[1] || "Hello, this is an automated email.",
    };
  }

  /**
   * Generate database query parameters from prompt
   */
  static generateDatabaseParams(prompt: string) {
    return {
      table: /table ([\w_]+)/i.exec(prompt)?.[1] || "users",
      operation: /insert|update|delete|select/i.exec(prompt)?.[0] || "select",
      fields: /fields ([\w, ]+)/i.exec(prompt)?.[1]?.split(/, ?/) || ["id", "email"],
      where: /where ([\w= ']+)/i.exec(prompt)?.[1] || undefined,
    };
  }

  /**
   * Generate custom parameters from prompt
   */
  static generateCustomParams(prompt: string) {
    // Fallback: extract key-value pairs like key: value
    const params: Record<string, any> = {};
    const regex = /(\w+): ([\w@.\/-]+)/g;
    let match;
    while ((match = regex.exec(prompt))) {
      params[match[1]] = match[2];
    }
    return params;
  }
}
