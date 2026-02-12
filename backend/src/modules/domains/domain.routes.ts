import { Router } from 'express';
import { DomainController } from './domain.controller';

const router = Router();

router.get('/', DomainController.listDomains);
router.post('/register', DomainController.registerDomain);
router.post('/:id/dns', DomainController.updateDNS);

export default router;
