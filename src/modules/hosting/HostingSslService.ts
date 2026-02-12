// HostingSslService.ts
import { HostingSiteModel } from "./HostingSiteModel";

export class HostingSslService {
  async enableSsl(siteId: string): Promise<boolean> {
    // Simulate Let's Encrypt issuance delay
    await new Promise((res) => setTimeout(res, 1200));
    await HostingSiteModel.update(siteId, { sslEnabled: true });
    return true;
  }

  async disableSsl(siteId: string): Promise<boolean> {
    await HostingSiteModel.update(siteId, { sslEnabled: false });
    return true;
  }

  async getSslStatus(siteId: string): Promise<boolean> {
    const site = await HostingSiteModel.findById(siteId);
    return !!site?.sslEnabled;
  }
}
