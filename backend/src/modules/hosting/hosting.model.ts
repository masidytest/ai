export interface HostingSite {
  id: string;
  domain: string;
  status: 'active' | 'pending' | 'suspended';
  plan: string;
}

// In-memory placeholder
export const hostingSites: HostingSite[] = [];
