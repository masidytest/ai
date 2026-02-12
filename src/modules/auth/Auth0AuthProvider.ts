// src/modules/auth/Auth0AuthProvider.ts
import { AuthService } from "./AuthService";
import type { User } from "./UserModel";

export class Auth0AuthProvider extends AuthService {
  async login(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    // Mock logic
    return {
      user: { id: "auth0-1", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "auth0-session-token",
    };
  }
  async register(email: string, password: string): Promise<{ user: User; sessionToken: string } | null> {
    return {
      user: { id: "auth0-2", email, role: "user", createdAt: new Date(), updatedAt: new Date() },
      sessionToken: "auth0-session-token",
    };
  }
  async logout(sessionToken: string): Promise<boolean> {
    return true;
  }
  async getUserFromSession(sessionToken: string): Promise<User | null> {
    return { id: "auth0-1", email: "user@auth0.com", role: "user", createdAt: new Date(), updatedAt: new Date() };
  }
  async refreshSession(sessionToken: string): Promise<{ sessionToken: string } | null> {
    return { sessionToken: "auth0-session-token-refreshed" };
  }
}
