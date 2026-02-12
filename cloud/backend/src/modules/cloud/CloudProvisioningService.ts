// CloudProvisioningService: Handles server creation, deletion, and status updates
import { CloudServerModel, CloudServer } from "./CloudServerModel";

export class CloudProvisioningService {
  private model = new CloudServerModel();

  async createServer(name: string, region: string, plan: string): Promise<CloudServer> {
    const server = this.model.create({
      name,
      region,
      plan,
      status: "creating",
    });
    // Simulate provisioning delay and IP assignment
    setTimeout(() => {
      this.model.update(server.id, {
        status: "running",
        ipAddress: `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`,
      });
    }, 2000);
    return server;
  }

  async deleteServer(id: string): Promise<boolean> {
    return this.model.delete(id);
  }

  async startServer(id: string): Promise<CloudServer | undefined> {
    const server = this.model.getById(id);
    if (server && server.status !== "running") {
      this.model.update(id, { status: "running" });
      return this.model.getById(id);
    }
    return server;
  }

  async stopServer(id: string): Promise<CloudServer | undefined> {
    const server = this.model.getById(id);
    if (server && server.status === "running") {
      this.model.update(id, { status: "stopped" });
      return this.model.getById(id);
    }
    return server;
  }

  async restartServer(id: string): Promise<CloudServer | undefined> {
    const server = this.model.getById(id);
    if (server && server.status === "running") {
      this.model.update(id, { status: "creating" });
      setTimeout(() => {
        this.model.update(id, { status: "running" });
      }, 1500);
      return this.model.getById(id);
    }
    return server;
  }

  async listServers(): Promise<CloudServer[]> {
    return this.model.getAll();
  }

  async getServer(id: string): Promise<CloudServer | undefined> {
    return this.model.getById(id);
  }
}
