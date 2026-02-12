import { Router } from 'express';
import { UiBuilderController } from './uiBuilder.controller';

const router = Router();

router.get('/apps', UiBuilderController.listApps);
router.post('/apps', UiBuilderController.createApp);
router.post('/apps/:id/publish', UiBuilderController.publishApp);

export default router;
