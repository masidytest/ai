export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'expired';
  expiresAt: Date;
}

// In-memory placeholder
export const domains: Domain[] = [];
