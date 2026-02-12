// HostingEmailService.ts
import { HostingSiteModel } from "./HostingSiteModel";

export class HostingEmailService {
  async enableEmail(id: string): Promise<boolean> {
    await HostingSiteModel.update(id, { emailEnabled: true });
    return true;
  }
  async disableEmail(id: string): Promise<boolean> {
    await HostingSiteModel.update(id, { emailEnabled: false });
    return true;
  }
}
