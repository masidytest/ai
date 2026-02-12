// DomainSearchService: Provides domain search, availability, and suggestions (stubbed)

const TLDs = [".com", ".net", ".io", ".dev"];

export class DomainSearchService {
  // Simulate random availability
  private isAvailable(name: string) {
    return Math.random() > 0.4;
  }

  async searchDomain(name: string) {
    const tld = name.includes(".") ? "" : ".com";
    const domain = name + tld;
    return {
      name: domain,
      available: this.isAvailable(domain),
    };
  }

  async checkAvailability(name: string) {
    return { name, available: this.isAvailable(name) };
  }

  async suggestAlternatives(name: string) {
    const base = name.replace(/\..*$/, "");
    return TLDs.map(tld => {
      const domain = base + tld;
      return {
        name: domain,
        available: this.isAvailable(domain),
      };
    });
  }
}
