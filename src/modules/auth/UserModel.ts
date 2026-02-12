// src/modules/auth/UserModel.ts

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

// In-memory user storage
export const users: User[] = [];
