// src/modules/auth/AuthService.ts

import type { User } from "./UserModel";

export abstract class AuthService {
  abstract login(email: string, password: string): Promise<{ user: User; sessionToken: string } | null>;
  abstract register(email: string, password: string): Promise<{ user: User; sessionToken: string } | null>;
  abstract logout(sessionToken: string): Promise<boolean>;
  abstract getUserFromSession(sessionToken: string): Promise<User | null>;
  abstract refreshSession(sessionToken: string): Promise<{ sessionToken: string } | null>;
}
