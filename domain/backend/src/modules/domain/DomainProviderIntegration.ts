// DomainProviderIntegration: Stubs for provider API (Namecheap/ResellerClub)

export class DomainProviderIntegration {
  async search(name: string) {
    // Mock: always available except for 'taken.com'
    return { name, available: name !== "taken.com" };
  }

  async register(name: string) {
    // Mock: always succeeds
    return { name, status: "registered", provider: "Namecheap" };
  }

  async updateDns(name: string, records: any[]) {
    // Mock: always succeeds
    return { name, updated: true, records };
  }

  async renew(name: string) {
    // Mock: always succeeds
    return { name, renewed: true, expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) };
  }
}
