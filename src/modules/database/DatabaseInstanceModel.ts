// src/modules/database/DatabaseInstanceModel.ts
// Prisma model stub for database instances

export interface DatabaseInstance {
  id: string;
  name: string;
  provider: string;
  region: string;
  status: "creating" | "running" | "error";
  connectionUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
export const databaseInstances: DatabaseInstance[] = [];
