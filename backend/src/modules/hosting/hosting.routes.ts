import { Router } from 'express';
import { HostingController } from './hosting.controller';

const router = Router();

router.get('/sites', HostingController.listSites);
router.post('/sites', HostingController.createSite);
router.delete('/sites/:id', HostingController.deleteSite);

export default router;
