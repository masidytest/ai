// src/modules/webhooks/WebhookService.ts

import { Webhook, webhooks } from './WebhookModel';
import { v4 as uuidv4 } from 'uuid';

export class WebhookService {
  createWebhook(url: string, secret: string, ownerId: string, projectId?: string): Webhook {
    const now = new Date();
    const webhook: Webhook = {
      id: uuidv4(),
      url,
      secret,
      ownerId,
      projectId,
      createdAt: now,
      updatedAt: now,
    };
    webhooks.push(webhook);
    return webhook;
  }

  getWebhook(id: string): Webhook | undefined {
    return webhooks.find(w => w.id === id);
  }

  listWebhooks(projectId?: string): Webhook[] {
    return projectId ? webhooks.filter(w => w.projectId === projectId) : webhooks;
  }

  deleteWebhook(id: string): void {
    const idx = webhooks.findIndex(w => w.id === id);
    if (idx !== -1) webhooks.splice(idx, 1);
  }
}
