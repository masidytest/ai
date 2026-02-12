// HostingEmailService.ts

interface EmailAccount {
  address: string;
  password: string;
}

// In-memory email accounts per site
const emailAccounts: Record<string, EmailAccount[]> = {};

export class HostingEmailService {
  async listEmailAccounts(siteId: string): Promise<EmailAccount[]> {
    return emailAccounts[siteId] || [];
  }

  async createEmailAccount(siteId: string, address: string, password: string): Promise<EmailAccount> {
    if (!emailAccounts[siteId]) emailAccounts[siteId] = [];
    const account = { address, password };
    emailAccounts[siteId].push(account);
    return account;
  }

  async deleteEmailAccount(siteId: string, address: string): Promise<boolean> {
    if (!emailAccounts[siteId]) return false;
    const idx = emailAccounts[siteId].findIndex(acc => acc.address === address);
    if (idx !== -1) {
      emailAccounts[siteId].splice(idx, 1);
      return true;
    }
    return false;
  }
}
