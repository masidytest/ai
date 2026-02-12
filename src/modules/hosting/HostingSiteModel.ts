// HostingSiteModel.ts
// In-memory stub for HostingSite

export interface HostingSite {
  id: string;
  domain: string;
  status: "creating" | "active" | "error";
  plan: string;
  ftpCredentials?: { user: string; password: string };
  sslEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    sites.push(newSite);
    return newSite;
  },
  async update(id: string, updates: Partial<HostingSite>): Promise<HostingSite | undefined> {
    const site = sites.find((s) => s.id === id);
    if (site) {
      Object.assign(site, updates, { updatedAt: new Date() });
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
