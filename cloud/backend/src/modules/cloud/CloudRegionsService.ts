// CloudRegionsService: Provides available regions and metadata

export interface CloudRegion {
  id: string;
  name: string;
  latency: number; // ms
  availability: number; // %
  costMultiplier: number;
}

const REGIONS: CloudRegion[] = [
  { id: "us-east", name: "US East", latency: 40, availability: 99.99, costMultiplier: 1.0 },
  { id: "us-west", name: "US West", latency: 55, availability: 99.98, costMultiplier: 1.05 },
  { id: "eu-central", name: "EU Central", latency: 70, availability: 99.97, costMultiplier: 1.1 },
  { id: "asia-south", name: "Asia South", latency: 120, availability: 99.95, costMultiplier: 1.15 },
];

export class CloudRegionsService {
  async listRegions(): Promise<CloudRegion[]> {
    return REGIONS;
  }
}
