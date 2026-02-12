import { Request, Response } from 'express';
import { AiRoutingEngineService } from './aiRoutingEngine.service';

export class AiRoutingEngineController {
  static classify(req: Request, res: Response) {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const result = AiRoutingEngineService.classifyPrompt(prompt);
    res.json(result);
  }
}
