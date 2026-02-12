// HostingSslService.ts
import { HostingSiteModel } from "./HostingSiteModel";

export class HostingSslService {
  async enableSsl(id: string): Promise<boolean> {
    await HostingSiteModel.update(id, { sslEnabled: true });
    return true;
  }
  async disableSsl(id: string): Promise<boolean> {
    await HostingSiteModel.update(id, { sslEnabled: false });
    return true;
  }
}
