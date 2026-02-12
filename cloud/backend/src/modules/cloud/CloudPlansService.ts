// CloudPlansService: Provides available server plans and pricing

export interface CloudPlan {
  id: string;
  name: string;
  cpu: number;
  ram: number; // GB
  disk: number; // GB
  price: number; // USD/month
}

const PLANS: CloudPlan[] = [
  { id: "nano", name: "Nano", cpu: 1, ram: 1, disk: 20, price: 5 },
  { id: "micro", name: "Micro", cpu: 1, ram: 2, disk: 40, price: 8 },
  { id: "small", name: "Small", cpu: 2, ram: 4, disk: 80, price: 15 },
  { id: "medium", name: "Medium", cpu: 4, ram: 8, disk: 160, price: 28 },
];

export class CloudPlansService {
  async listPlans(): Promise<CloudPlan[]> {
    return PLANS;
  }
}
