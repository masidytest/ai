import { Router } from 'express';
import { BillingController } from './billing.controller';

const router = Router();

router.get('/usage', BillingController.getUsage);
router.get('/invoices', BillingController.listInvoices);
router.post('/payment-method', BillingController.updatePaymentMethod);

export default router;
