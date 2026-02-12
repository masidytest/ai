import { Request, Response } from 'express';
import { AiIdeService } from './aiIde.service';

export class AiIdeController {
  static async generate(req: Request, res: Response) {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });
    const code = await AiIdeService.generateCode(prompt);
    res.json({ code });
  }

  static async refactor(req: Request, res: Response) {
    const { code, instruction } = req.body;
    if (!code || !instruction) return res.status(400).json({ error: 'Missing code or instruction' });
    const result = await AiIdeService.refactorCode(code, instruction);
    res.json({ code: result });
  }

  static async explain(req: Request, res: Response) {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing code' });
    const explanation = await AiIdeService.explainCode(code);
    res.json({ explanation });
  }
}
