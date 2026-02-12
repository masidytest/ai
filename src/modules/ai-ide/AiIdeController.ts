// src/modules/ai-ide/AiIdeController.ts
import { Router, Request, Response } from "express";
import { ProjectContextBuilder } from "./ProjectContextBuilder";
import { AiCodeGeneratorService } from "./AiCodeGeneratorService";
import { AiCodeRefactorService } from "./AiCodeRefactorService";
import { AiCodeExplainService } from "./AiCodeExplainService";
import { AiCodeFixService } from "./AiCodeFixService";
import { AiCodeCompletionService } from "./AiCodeCompletionService";

const router = Router();

// POST /ai-ide/code/generate
router.post("/ai-ide/code/generate", async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const context = await ProjectContextBuilder.buildProjectContext();
  const result = await AiCodeGeneratorService.generateCode(prompt, context);
  res.json(result);
});

// POST /ai-ide/code/refactor
router.post("/ai-ide/code/refactor", async (req: Request, res: Response) => {
  const { code, instructions } = req.body;
  const result = await AiCodeRefactorService.refactorCode(code, instructions);
  res.json(result);
});

// POST /ai-ide/code/explain
router.post("/ai-ide/code/explain", async (req: Request, res: Response) => {
  const { code } = req.body;
  const result = await AiCodeExplainService.explainCode(code);
  res.json(result);
});

// POST /ai-ide/code/fix
router.post("/ai-ide/code/fix", async (req: Request, res: Response) => {
  const { code } = req.body;
  const result = await AiCodeFixService.fixErrors(code);
  res.json(result);
});

// POST /ai-ide/code/complete
router.post("/ai-ide/code/complete", async (req: Request, res: Response) => {
  const { code, cursorPosition } = req.body;
  const result = await AiCodeCompletionService.completeLine(code, cursorPosition);
  res.json(result);
});

// POST /ai-ide/code/generate-tests
router.post("/ai-ide/code/generate-tests", async (req: Request, res: Response) => {
  const { code } = req.body;
  const context = await ProjectContextBuilder.buildProjectContext();
  const result = await AiCodeGeneratorService.generateTests(code, context);
  res.json(result);
});

export default router;
