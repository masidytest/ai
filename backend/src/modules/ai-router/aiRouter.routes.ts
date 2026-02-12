import { Router } from 'express';
import { AiRouterController } from './aiRouter.controller';

const router = Router();

router.post('/route', AiRouterController.route);

export default router;
