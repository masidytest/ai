// src/modules/notifications/NotificationModel.ts

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
  channel: 'email' | 'in-app' | 'webhook';
}

export const notifications: Notification[] = [];
