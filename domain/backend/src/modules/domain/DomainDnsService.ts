// DomainDnsService: Manages DNS records for domains (in-memory)
import { DomainModel, Domain } from "./DomainModel";

export type DnsRecordType = "A" | "AAAA" | "CNAME" | "TXT" | "MX" | "NS";

export interface DnsRecord {
  id: string;
  type: DnsRecordType;
  name: string;
  value: string;
  ttl?: number;
  priority?: number; // for MX
}

export class DomainDnsService {
  private model = new DomainModel();

  getDnsRecords(domainId: string): DnsRecord[] {
    const domain = this.model.getById(domainId);
    return (domain?.dnsRecords as DnsRecord[]) || [];
  }

  addDnsRecord(domainId: string, record: Omit<DnsRecord, "id">): DnsRecord | undefined {
    const domain = this.model.getById(domainId);
    if (!domain) return undefined;
    const newRecord: DnsRecord = {
      ...record,
      id: `dns-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    domain.dnsRecords = [...(domain.dnsRecords || []), newRecord];
    this.model.update(domainId, { dnsRecords: domain.dnsRecords });
    return newRecord;
  }

  updateDnsRecord(domainId: string, recordId: string, data: Partial<DnsRecord>): DnsRecord | undefined {
    const domain = this.model.getById(domainId);
    if (!domain || !domain.dnsRecords) return undefined;
    const idx = domain.dnsRecords.findIndex((r: DnsRecord) => r.id === recordId);
    if (idx === -1) return undefined;
    const updated = { ...domain.dnsRecords[idx], ...data };
    domain.dnsRecords[idx] = updated;
    this.model.update(domainId, { dnsRecords: domain.dnsRecords });
    return updated;
  }

  deleteDnsRecord(domainId: string, recordId: string): boolean {
    const domain = this.model.getById(domainId);
    if (!domain || !domain.dnsRecords) return false;
    const before = domain.dnsRecords.length;
    domain.dnsRecords = domain.dnsRecords.filter((r: DnsRecord) => r.id !== recordId);
    this.model.update(domainId, { dnsRecords: domain.dnsRecords });
    return domain.dnsRecords.length < before;
  }
}
