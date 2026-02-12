// src/modules/notifications/NotificationPreferencesService.ts

interface NotificationPreferences {
  userId: string;
  email: boolean;
  inApp: boolean;
  webhook: boolean;
}

const preferences: NotificationPreferences[] = [];

export class NotificationPreferencesService {
  getPreferences(userId: string): NotificationPreferences {
    let pref = preferences.find(p => p.userId === userId);
    if (!pref) {
      pref = { userId, email: true, inApp: true, webhook: false };
      preferences.push(pref);
    }
    return pref;
  }

  updatePreferences(userId: string, updates: Partial<Omit<NotificationPreferences, 'userId'>>): void {
    const pref = this.getPreferences(userId);
    Object.assign(pref, updates);
  }
}
