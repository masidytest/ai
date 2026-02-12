// src/modules/webhooks/WebhookDeliveryService.ts

import { Webhook, WebhookDeliveryLog, webhookDeliveryLogs } from './WebhookModel';
import { v4 as uuidv4 } from 'uuid';

export class WebhookDeliveryService {
  deliver(webhook: Webhook, payload: any): void {
    // Stub: simulate delivery
    webhookDeliveryLogs.push({
      id: uuidv4(),
      webhookId: webhook.id,
      status: 'success',
      timestamp: new Date(),
      response: 'Delivered (stub)',
    });
  }

  retryDelivery(logId: string): void {
    // Stub: simulate retry logic
    // (No-op or log)
  }

  listLogs(webhookId: string): WebhookDeliveryLog[] {
    return webhookDeliveryLogs.filter(l => l.webhookId === webhookId);
  }
}
