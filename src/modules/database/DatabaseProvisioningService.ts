// src/modules/database/DatabaseProvisioningService.ts
import { DatabaseInstance, databaseInstances } from "./DatabaseInstanceModel";

export class DatabaseProvisioningService {
  static async createDatabase(name: string, provider: string, region: string): Promise<DatabaseInstance> {
    const id = Math.random().toString(36).slice(2);
    const now = new Date();
    const db: DatabaseInstance = {
      id,
      name,
      provider,
      region,
      status: "creating",
      createdAt: now,
      updatedAt: now,
    };
    databaseInstances.push(db);
    // Simulate async provisioning
    setTimeout(() => {
      db.status = "running";
      db.connectionUrl = `postgres://${id}@${provider}.${region}.db.example.com:5432/${name}`;
      db.updatedAt = new Date();
    }, 1200 + Math.random() * 1800);
    return db;
  }

  static async deleteDatabase(id: string): Promise<boolean> {
    const idx = databaseInstances.findIndex(db => db.id === id);
    if (idx === -1) return false;
    databaseInstances.splice(idx, 1);
    return true;
  }

  static getDatabaseStatus(id: string): "creating" | "running" | "error" | undefined {
    const db = databaseInstances.find(db => db.id === id);
    return db?.status;
  }
}
