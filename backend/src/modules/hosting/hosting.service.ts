import { hostingSites, HostingSite } from './hosting.model';
import { v4 as uuidv4 } from 'uuid';

export class HostingService {
  static listSites(): HostingSite[] {
    return hostingSites;
  }

  static createSite(data: { domain: string; plan: string }): HostingSite {
    // Placeholder for ResellersPanel integration
    const site: HostingSite = {
      id: uuidv4(),
      domain: data.domain,
      plan: data.plan,
      status: 'pending',
    };
    hostingSites.push(site);
    return site;
  }

  static deleteSite(id: string): boolean {
    const idx = hostingSites.findIndex(s => s.id === id);
    if (idx === -1) return false;
    hostingSites.splice(idx, 1);
    return true;
  }
}
