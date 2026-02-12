// HostingSiteModel.ts
// Prisma-like stub for HostingSite

export interface HostingSite {
  id: string;
  name: string;
  domain: string;
  status: "provisioning" | "active" | "suspended" | "error";
  createdAt: string;
  updatedAt: string;
  dnsLinked: boolean;
  sslEnabled: boolean;
  emailEnabled: boolean;
}

const sites: HostingSite[] = [];

export const HostingSiteModel = {
  async findAll(): Promise<HostingSite[]> {
    return sites;
  },
  async findById(id: string): Promise<HostingSite | undefined> {
    return sites.find((s) => s.id === id);
  },
  async create(site: Omit<HostingSite, "id" | "createdAt" | "updatedAt">): Promise<HostingSite> {
    const newSite: HostingSite = {
      ...site,
      id: Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    sites.push(newSite);
    return newSite;
  },
  async update(id: string, updates: Partial<HostingSite>): Promise<HostingSite | undefined> {
    const site = sites.find((s) => s.id === id);
    if (site) {
      Object.assign(site, updates, { updatedAt: new Date().toISOString() });
    }
    return site;
  },
  async delete(id: string): Promise<boolean> {
    const idx = sites.findIndex((s) => s.id === id);
    if (idx !== -1) {
      sites.splice(idx, 1);
      return true;
    }
    return false;
  },
};
