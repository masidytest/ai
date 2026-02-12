import { Router } from 'express';
import { CloudController } from './cloud.controller';

const router = Router();

router.get('/servers', CloudController.listServers);
router.post('/servers', CloudController.createServer);
router.delete('/servers/:id', CloudController.deleteServer);

export default router;
