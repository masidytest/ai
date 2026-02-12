// src/modules/notifications/NotificationService.ts

import { Notification, notifications } from './NotificationModel';
import { v4 as uuidv4 } from 'uuid';

export class NotificationService {
  sendNotification(userId: string, type: string, message: string, channel: 'email' | 'in-app' | 'webhook'): Notification {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      type,
      message,
      read: false,
      createdAt: new Date(),
      channel,
    };
    notifications.push(notification);
    return notification;
  }

  listNotifications(userId: string): Notification[] {
    return notifications.filter(n => n.userId === userId);
  }

  markAsRead(notificationId: string): void {
    const n = notifications.find(n => n.id === notificationId);
    if (n) n.read = true;
  }
}
