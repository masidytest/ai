// src/modules/billing/BillingController.ts

import { Router, Request, Response } from 'express';
import { SubscriptionPlansService } from './SubscriptionPlansService';
import { BillingService } from './BillingService';
import { StripeWebhookHandler } from './StripeWebhookHandler';

const plansService = new SubscriptionPlansService();
const billingService = new BillingService();
const webhookHandler = new StripeWebhookHandler(billingService);

export const BillingController = Router();

// GET /billing/plans
BillingController.get('/plans', (req: Request, res: Response) => {
  res.json(plansService.listPlans());
});

// POST /billing/subscribe
BillingController.post('/subscribe', (req: Request, res: Response) => {
  const { userId, planId } = req.body;
  try {
    const sub = billingService.createSubscription(userId, planId);
    res.json(sub);
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

// POST /billing/cancel
BillingController.post('/cancel', (req: Request, res: Response) => {
  const { subscriptionId } = req.body;
  try {
    billingService.cancelSubscription(subscriptionId);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

// GET /billing/invoices
BillingController.get('/invoices', (req: Request, res: Response) => {
  const { userId } = req.query;
  if (typeof userId !== 'string') return res.status(400).json({ error: 'Missing userId' });
  res.json(billingService.getInvoices(userId));
});

// POST /billing/payment-method
BillingController.post('/payment-method', (req: Request, res: Response) => {
  const { userId, paymentMethod } = req.body;
  try {
    billingService.attachPaymentMethod(userId, paymentMethod);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: (e as Error).message });
  }
});

// POST /billing/webhook (stub)
BillingController.post('/webhook', (req: Request, res: Response) => {
  const { eventType, payload } = req.body;
  webhookHandler.handleEvent(eventType, payload);
  res.json({ received: true });
});
