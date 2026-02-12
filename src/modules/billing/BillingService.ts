// src/modules/billing/BillingService.ts

export interface BillingCustomer {
  id: string;
  userId: string;
  paymentMethods: string[];
  createdAt: Date;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  active: boolean;
  createdAt: Date;
  canceledAt?: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  subscriptionId: string;
  amount: number;
  createdAt: Date;
  paid: boolean;
}

import { v4 as uuidv4 } from 'uuid';

export class BillingService {
  private customers: BillingCustomer[] = [];
  private subscriptions: Subscription[] = [];
  private invoices: Invoice[] = [];

  /**
   * Simulate customer creation.
   */
  createCustomer(userId: string): BillingCustomer {
    let customer = this.customers.find(c => c.userId === userId);
    if (!customer) {
      customer = {
        id: uuidv4(),
        userId,
        paymentMethods: [],
        createdAt: new Date(),
      };
      this.customers.push(customer);
    }
    return customer;
  }

  /**
   * Simulate attaching a payment method to a customer.
   */
  attachPaymentMethod(userId: string, paymentMethod: string): void {
    const customer = this.customers.find(c => c.userId === userId);
    if (!customer) throw new Error('Customer not found');
    customer.paymentMethods.push(paymentMethod);
  }

  /**
   * Simulate subscription creation.
   */
  createSubscription(userId: string, planId: string): Subscription {
    const subscription: Subscription = {
      id: uuidv4(),
      userId,
      planId,
      active: true,
      createdAt: new Date(),
    };
    this.subscriptions.push(subscription);
    // Simulate invoice creation
    const invoice: Invoice = {
      id: uuidv4(),
      userId,
      subscriptionId: subscription.id,
      amount: 100, // stub amount
      createdAt: new Date(),
      paid: true,
    };
    this.invoices.push(invoice);
    return subscription;
  }

  /**
   * Simulate subscription cancellation.
   */
  cancelSubscription(subscriptionId: string): void {
    const sub = this.subscriptions.find(s => s.id === subscriptionId);
    if (sub && sub.active) {
      sub.active = false;
      sub.canceledAt = new Date();
    }
  }

  /**
   * Simulate invoice retrieval for a user.
   */
  getInvoices(userId: string): Invoice[] {
    return this.invoices.filter(i => i.userId === userId);
  }
}
