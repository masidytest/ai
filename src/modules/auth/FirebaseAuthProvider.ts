// src/modules/auth/FirebaseAuthProvider.ts
import { AuthService } from "./AuthService";
import type { User } from "./UserModel";

export class FirebaseAuthProvider extends AuthService {
  async login(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    // Mock logic
    return {
      user: { id: "firebase-1", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "firebase-session-token",
    };
  }
  async register(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    return {
      user: { id: "firebase-2", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "firebase-session-token",
    };
  }
  async logout(sessionToken: string): Promise<boolean> {
    return true;
  }
  async getUserFromSession(sessionToken: string): Promise<User | null> {
    return { id: "firebase-1", email: "user@firebase.com", role: "user", createdAt: new Date(), updatedAt: new Date() };
  }
  async refreshSession(sessionToken: string): Promise<{ sessionToken: string } | null> {
    return { sessionToken: "firebase-session-token-refreshed" };
  }
}
