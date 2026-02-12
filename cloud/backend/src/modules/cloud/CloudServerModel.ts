// src/modules/cloud/CloudServerModel.ts

export interface CloudServer {
  id: string;
  name: string;
  region: string;
  plan: string;
  status: "creating" | "running" | "stopped" | "error";
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CloudServerModel {
  private servers: CloudServer[] = [];

  getAll(): CloudServer[] {
    return this.servers;
  }

  getById(id: string): CloudServer | undefined {
    return this.servers.find(s => s.id === id);
  }

  create(server: Omit<CloudServer, "id" | "createdAt" | "updatedAt">): CloudServer {
    const newServer: CloudServer = {
      ...server,
      id: `srv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.servers.push(newServer);
    return newServer;
  }

  update(id: string, data: Partial<CloudServer>): CloudServer | undefined {
    const server = this.getById(id);
    if (server) {
      Object.assign(server, data, { updatedAt: new Date() });
      return server;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const idx = this.servers.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.servers.splice(idx, 1);
      return true;
    }
    return false;
  }
}
