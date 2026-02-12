import { Request, Response } from 'express';
import { WorkflowService } from './workflow.service';

export class WorkflowController {
  static listWorkflows(_req: Request, res: Response) {
    const all = WorkflowService.listWorkflows();
    res.json(all);
  }

  static createWorkflow(req: Request, res: Response) {
    const { name, nodes, connections } = req.body;
    if (!name || !Array.isArray(nodes) || !Array.isArray(connections)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    try {
      const workflow = WorkflowService.createWorkflow({ name, nodes, connections });
      res.status(201).json(workflow);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static runWorkflow(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = WorkflowService.runWorkflow(id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
