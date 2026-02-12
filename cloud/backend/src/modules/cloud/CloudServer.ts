// Prisma model stub for CloudServer
export interface CloudServer {
  id: string;
  name: string;
  region: string;
  plan: string;
  status: 'provisioning' | 'running' | 'stopped' | 'error';
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
  provider: 'vultr' | 'hetzner' | 'do' | 'custom';
  metrics?: Record<string, any>;
  logs?: string[];
}
