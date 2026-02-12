// src/modules/webhooks/WebhookModel.ts

export interface Webhook {
  id: string;
  url: string;
  secret: string;
  ownerId: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const webhooks: Webhook[] = [];

export interface WebhookDeliveryLog {
  id: string;
  webhookId: string;
  status: 'success' | 'failed';
  timestamp: Date;
  response?: string;
}

export const webhookDeliveryLogs: WebhookDeliveryLog[] = [];
