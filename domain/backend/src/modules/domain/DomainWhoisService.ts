// DomainWhoisService: Returns mock WHOIS data for domains

export class DomainWhoisService {
  async lookup(name: string) {
    // Mock data
    return {
      domain: name,
      registrar: "Namecheap, Inc.",
      creationDate: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      expirationDate: new Date(Date.now() + 1 * 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      owner: "REDACTED FOR PRIVACY",
      nameservers: ["ns1.example.com", "ns2.example.com"],
    };
  }
}
