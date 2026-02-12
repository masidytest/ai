import { Request, Response } from 'express';
import { UiBuilderService } from './uiBuilder.service';

export class UiBuilderController {
  static listApps(_req: Request, res: Response) {
    const all = UiBuilderService.listApps();
    res.json(all);
  }

  static createApp(req: Request, res: Response) {
    const { name, components, layout } = req.body;
    if (!name || !Array.isArray(components) || !layout) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    try {
      const app = UiBuilderService.createApp({ name, components, layout });
      res.status(201).json(app);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static publishApp(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const result = UiBuilderService.publishApp(id);
      res.json(result);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}
