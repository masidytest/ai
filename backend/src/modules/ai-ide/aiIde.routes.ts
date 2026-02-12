import { Router } from 'express';
import { AiIdeController } from './aiIde.controller';

const router = Router();

router.post('/generate', AiIdeController.generate);
router.post('/refactor', AiIdeController.refactor);
router.post('/explain', AiIdeController.explain);

export default router;
