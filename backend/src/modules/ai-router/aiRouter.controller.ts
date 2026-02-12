import { Request, Response } from 'express';
import { IntentClassifier } from '../ai-routing-engine/intentClassifier.service';
import { RedirectMapper } from '../ai-routing-engine/redirectMapper.service';

const classifier = new IntentClassifier();

export class AiRouterController {
  static route(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Missing or invalid prompt' });
      }
      const { intent, confidence } = classifier.classify(prompt);
      const redirect = RedirectMapper.getRoute(intent);
      res.json({ intent, confidence, redirect, metadata: {} });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  }
}
