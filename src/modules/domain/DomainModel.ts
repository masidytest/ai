// src/modules/domain/DomainModel.ts

export interface Domain {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'active' | 'error';
}

export const domains: Domain[] = [];
