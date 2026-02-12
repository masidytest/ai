// src/modules/auth/SessionService.ts
import { v4 as uuidv4 } from "uuid";
import { users, User } from "./UserModel";

export interface Session {
  token: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const sessions = new Map<string, Session>();

export class SessionService {
  static createSession(userId: string): Session {
    const token = uuidv4();
    const now = new Date();
    const session: Session = {
      token,
      userId,
      createdAt: now,
      expiresAt: new Date(now.getTime() + SESSION_DURATION_MS),
    };
    sessions.set(token, session);
    return session;
  }

  static validateSession(token: string): User | null {
    const session = sessions.get(token);
    if (!session) return null;
    if (session.expiresAt < new Date()) {
      sessions.delete(token);
      return null;
    }
    return users.find(u => u.id === session.userId) || null;
  }

  static refreshSession(token: string): Session | null {
    const session = sessions.get(token);
    if (!session) return null;
    session.expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    return session;
  }

  static revokeSession(token: string): void {
    sessions.delete(token);
  }

  static getUserFromSession(token: string): User | null {
    return this.validateSession(token);
  }
}
