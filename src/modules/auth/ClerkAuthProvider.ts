// src/modules/auth/ClerkAuthProvider.ts
import { AuthService } from "./AuthService";
import type { User } from "./UserModel";

export class ClerkAuthProvider extends AuthService {
  async login(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    // Mock logic
    return {
      user: { id: "clerk-1", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "clerk-session-token",
    };
  }
  async register(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    return {
      user: { id: "clerk-2", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "clerk-session-token",
    };
  }
  async logout(sessionToken: string): Promise<boolean> {
    return true;
  }
  async getUserFromSession(sessionToken: string): Promise<User | null> {
    return { id: "clerk-1", email: "user@clerk.dev", role: "user", createdAt: new Date(), updatedAt: new Date() };
  }
  async refreshSession(sessionToken: string): Promise<{ sessionToken: string } | null> {
    return { sessionToken: "clerk-session-token-refreshed" };
  }
}
