import { Request, Response } from 'express';
import { BillingService } from './billing.service';

export class BillingController {
  static getUsage(req: Request, res: Response) {
    // In real app, get userId from auth
    const userId = req.user?.id || 'demo-user';
    const usage = BillingService.getUsage(userId);
    res.json(usage);
  }

  static listInvoices(req: Request, res: Response) {
    const userId = req.user?.id || 'demo-user';
    const invoices = BillingService.listInvoices(userId);
    res.json(invoices);
  }

  static updatePaymentMethod(req: Request, res: Response) {
    const userId = req.user?.id || 'demo-user';
    const paymentMethod = req.body;
    const ok = BillingService.updatePaymentMethod(userId, paymentMethod);
    if (!ok) return res.status(400).json({ error: 'Failed to update payment method' });
    res.status(204).send();
  }
}
