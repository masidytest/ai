import { Router, Request, Response, NextFunction } from 'express';
import { AiRoutingService } from './aiRoutingService';

const router = Router();
const aiRoutingService = new AiRoutingService();

// Request validation middleware
function validatePrompt(req: Request, res: Response, next: NextFunction) {
	const { prompt } = req.body;
	if (!prompt || typeof prompt !== 'string') {
		return res.status(400).json({ error: 'Missing or invalid prompt' });
	}
	next();
}

// POST /ai/route
router.post('/route', validatePrompt, (req: Request, res: Response, next: NextFunction) => {
	try {
		const { prompt } = req.body;
		const result = aiRoutingService.routePrompt(prompt);
		// Log intent and confidence
		console.log(`[AiRouting] intent: ${result.intent}, confidence: ${result.confidence}`);
		res.json(result);
	} catch (err) {
		next(err);
	}
});

export default router;
