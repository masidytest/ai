// src/modules/billing/SubscriptionPlansService.ts

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
}

export class SubscriptionPlansService {
  private plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      features: ['Basic usage', 'Community support'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 20,
      features: ['All Free features', 'Priority support', 'Advanced tools'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 100,
      features: ['All Pro features', 'Dedicated manager', 'Custom integrations'],
    },
  ];

  listPlans(): SubscriptionPlan[] {
    return this.plans;
  }

  getPlan(planId: string): SubscriptionPlan | undefined {
    return this.plans.find(p => p.id === planId);
  }

  createPlan(id: string, name: string, price: number, features: string[]): SubscriptionPlan {
    const plan: SubscriptionPlan = { id, name, price, features };
    this.plans.push(plan);
    return plan;
  }

  deletePlan(id: string): void {
    this.plans = this.plans.filter(p => p.id !== id);
  }
}
