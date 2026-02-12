// DomainRegistrationService: Handles domain registration (stubbed)
import { DomainModel, Domain } from "./DomainModel";

export class DomainRegistrationService {
  private model = new DomainModel();

  async registerDomain(name: string, userId: string): Promise<Domain> {
    // Simulate provider API call and propagation delay
    const domain = this.model.create({
      name,
      status: "pending",
      nameservers: ["ns1.example.com", "ns2.example.com"],
      dnsRecords: [],
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });
    setTimeout(() => {
      this.model.update(domain.id, { status: "registered" });
    }, 2000); // Simulate 2s propagation
    return domain;
  }
}
