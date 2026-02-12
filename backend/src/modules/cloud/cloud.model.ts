export interface CloudServer {
  id: string;
  name: string;
  region: string;
  size: string;
  status: 'running' | 'stopped' | 'provisioning';
}

// In-memory placeholder
export const cloudServers: CloudServer[] = [];
