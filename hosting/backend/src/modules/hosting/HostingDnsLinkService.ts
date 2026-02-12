// HostingDnsLinkService.ts
import { HostingSiteModel } from "./HostingSiteModel";

export class HostingDnsLinkService {
  async linkDns(id: string): Promise<boolean> {
    // Simulate DNS linking
    await HostingSiteModel.update(id, { dnsLinked: true });
    return true;
  }
  async unlinkDns(id: string): Promise<boolean> {
    await HostingSiteModel.update(id, { dnsLinked: false });
    return true;
  }
}
