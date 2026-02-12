import { cloudServers, CloudServer } from './cloud.model';
import { v4 as uuidv4 } from 'uuid';

export class CloudService {
  static listServers(): CloudServer[] {
    return cloudServers;
  }

  static createServer(data: { name: string; region: string; size: string }): CloudServer {
    // Placeholder for integration with Vultr/DO/Hetzner
    const server: CloudServer = {
      id: uuidv4(),
      name: data.name,
      region: data.region,
      size: data.size,
      status: 'provisioning',
    };
    cloudServers.push(server);
    return server;
  }

  static deleteServer(id: string): boolean {
    const idx = cloudServers.findIndex(s => s.id === id);
    if (idx === -1) return false;
    cloudServers.splice(idx, 1);
    return true;
  }
}
