// HostingProvisioningService.ts
import { HostingSiteModel, HostingSite } from "./HostingSiteModel";

function generateFtpCredentials(domain: string) {
  return {
    user: domain.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) + Math.floor(Math.random() * 1000),
    password: Math.random().toString(36).slice(2, 10),
  };
}

export class HostingProvisioningService {
  async createSite(domain: string, plan: string): Promise<HostingSite> {
    // Simulate provisioning delay
    const site = await HostingSiteModel.create({
      domain,
      plan,
      status: "creating",
      ftpCredentials: undefined,
      sslEnabled: false,
    });
    // Simulate async provisioning and status change
    setTimeout(async () => {
      await HostingSiteModel.update(site.id, {
        status: "active",
        ftpCredentials: generateFtpCredentials(domain),
      });
    }, 1200);
    return site;
  }

  async deleteSite(id: string): Promise<boolean> {
    // Simulate deletion delay
    await new Promise((res) => setTimeout(res, 500));
    return HostingSiteModel.delete(id);
  }

  async getSiteStatus(id: string): Promise<"creating" | "active" | "error"> {
    const site = await HostingSiteModel.findById(id);
    return site ? site.status : "error";
  }
}
