// src/modules/webhooks/WebhookSigningSecret.ts

export class WebhookSigningSecret {
  static generate(): string {
    // Stub: return random string
    return Math.random().toString(36).slice(2);
  }
}
