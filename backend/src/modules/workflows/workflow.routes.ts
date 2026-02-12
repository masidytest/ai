import { Router } from 'express';
import { WorkflowController } from './workflow.controller';

const router = Router();

router.get('/', WorkflowController.listWorkflows);
router.post('/', WorkflowController.createWorkflow);
router.post('/:id/run', WorkflowController.runWorkflow);

export default router;
