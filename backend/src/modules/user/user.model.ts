export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

// In-memory user store for demo (replace with DB in production)
export const users: User[] = [];
