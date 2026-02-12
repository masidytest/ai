import express from 'express';
import { aiAssistantService } from './AiAssistantService';
import { executionEngine } from './ExecutionEngine';
import { fileSystemService } from './FileSystemService';

export const AiIdeController = express.Router();

// POST /ai-ide/generate
AiIdeController.post('/generate', async (req, res) => {
  const { prompt, context } = req.body;
  const result = await aiAssistantService.generateCode(prompt, context);
  res.json({ result });
});

// POST /ai-ide/refactor
AiIdeController.post('/refactor', async (req, res) => {
  const { code, instructions } = req.body;
  const result = await aiAssistantService.refactorCode(code, instructions);
  res.json({ result });
});

// POST /ai-ide/explain
AiIdeController.post('/explain', async (req, res) => {
  const { code } = req.body;
  const result = await aiAssistantService.explainCode(code);
  res.json({ result });
});

// POST /ai-ide/run
AiIdeController.post('/run', async (req, res) => {
  const { language, code, input } = req.body;
  const result = await executionEngine.runCode(language, code, input);
  res.json(result);
});

// GET /ai-ide/project/:id
AiIdeController.get('/project/:id', (req, res) => {
  const project = fileSystemService.loadProject(req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST /ai-ide/project
AiIdeController.post('/project', (req, res) => {
  const { name } = req.body;
  const project = fileSystemService.createProject(name);
  res.json(project);
});
