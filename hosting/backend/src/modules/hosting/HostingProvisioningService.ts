// HostingProvisioningService.ts
import { HostingSite, HostingSiteModel } from "./HostingSiteModel";

export class HostingProvisioningService {
  async provisionSite(data: { name: string; domain: string }): Promise<HostingSite> {
    // Simulate provisioning
    return HostingSiteModel.create({
      name: data.name,
      domain: data.domain,
      status: "provisioning",
      dnsLinked: false,
      sslEnabled: false,
      emailEnabled: false,
    });
  }
  async activateSite(id: string): Promise<HostingSite | undefined> {
    // Simulate activation
    return HostingSiteModel.update(id, { status: "active" });
  }
  async suspendSite(id: string): Promise<HostingSite | undefined> {
    return HostingSiteModel.update(id, { status: "suspended" });
  }
  async errorSite(id: string): Promise<HostingSite | undefined> {
    return HostingSiteModel.update(id, { status: "error" });
  }
}
