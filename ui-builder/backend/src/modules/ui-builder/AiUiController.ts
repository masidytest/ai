import { Router, Request, Response } from 'express';
import { AiUiGeneratorService } from './AiUiGeneratorService';
import { PropsGenerator } from './PropsGenerator';

const router = Router();
const aiService = new AiUiGeneratorService();

// POST /ai-ui/generate
router.post('/ai-ui/generate', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const layout = await aiService.generateLayout(prompt);
  const tree = await aiService.generateComponentTree(prompt);
  res.json({ layout, tree });
});

// POST /ai-ui/generate/layout
router.post('/ai-ui/generate/layout', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const layout = await aiService.generateLayout(prompt);
  res.json({ layout });
});

// POST /ai-ui/generate/components
router.post('/ai-ui/generate/components', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const tree = await aiService.generateComponentTree(prompt);
  res.json({ tree });
});

// POST /ai-ui/generate/props
router.post('/ai-ui/generate/props', async (req: Request, res: Response) => {
  const { type, prompt } = req.body;
  let props = {};
  if (type === 'Text') props = PropsGenerator.generateTextProps(prompt);
  else if (type === 'Input') props = PropsGenerator.generateInputProps(prompt);
  else if (type === 'Button') props = PropsGenerator.generateButtonProps(prompt);
  else if (type === 'Table') props = PropsGenerator.generateTableProps(prompt);
  else if (type === 'Card') props = PropsGenerator.generateCardProps(prompt);
  res.json({ props });
});

export default router;
