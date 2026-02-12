// src/modules/domain/DomainModel.ts

export interface Domain {
  id: string;
  name: string;
  status: "available" | "registered" | "pending" | "expired";
  expiresAt?: Date;
  nameservers?: string[];
  dnsRecords?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export class DomainModel {
  private domains: Domain[] = [];

  getAll(): Domain[] {
    return this.domains;
  }

  getById(id: string): Domain | undefined {
    return this.domains.find(d => d.id === id);
  }

  create(domain: Omit<Domain, "id" | "createdAt" | "updatedAt">): Domain {
    const newDomain: Domain = {
      ...domain,
      id: `dom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.domains.push(newDomain);
    return newDomain;
  }

  update(id: string, data: Partial<Domain>): Domain | undefined {
    const domain = this.getById(id);
    if (domain) {
      Object.assign(domain, data, { updatedAt: new Date() });
      return domain;
    }
    return undefined;
  }

  delete(id: string): boolean {
    const idx = this.domains.findIndex(d => d.id === id);
    if (idx !== -1) {
      this.domains.splice(idx, 1);
      return true;
    }
    return false;
  }
}
