// src/modules/workflow/AiWorkflowController.ts
// Express controller for AI workflow generation endpoints

import { Request, Response, Router } from "express";
import { AiWorkflowGeneratorService } from "./AiWorkflowGeneratorService";
import { NodeGenerator } from "./NodeGenerator";
import { ConnectionGenerator } from "./ConnectionGenerator";
import { TriggerGenerator } from "./TriggerGenerator";
import { PromptParser } from "./PromptParser";

const router = Router();

// POST /ai-workflow/generate
router.post("/ai-workflow/generate", (req: Request, res: Response) => {
  const { prompt } = req.body;
  const workflow = AiWorkflowGeneratorService.generateWorkflow(prompt);
  res.json({ workflow });
});

// POST /ai-workflow/generate/nodes
router.post("/ai-workflow/generate/nodes", (req: Request, res: Response) => {
  const { prompt } = req.body;
  const intent = PromptParser.extractTriggerIntent(prompt);
  const actions = PromptParser.extractActions(prompt);
  const conditions = PromptParser.extractConditions(prompt);
  const dataSources = PromptParser.extractDataSources(prompt);
  const nodes = [
    NodeGenerator.createTriggerNode(intent),
    ...NodeGenerator.createActionNodes(actions),
    ...NodeGenerator.createConditionNodes(conditions),
    ...NodeGenerator.createUtilityNodes(dataSources),
  ];
  res.json({ nodes });
});

// POST /ai-workflow/generate/connections
router.post("/ai-workflow/generate/connections", (req: Request, res: Response) => {
  const { nodes, prompt } = req.body;
  const conditions = PromptParser.extractConditions(prompt);
  let connections = [];
  if (conditions.length) {
    connections = ConnectionGenerator.connectConditional(nodes, nodes.filter((n: any) => n.type === "condition"));
  } else {
    connections = ConnectionGenerator.connectSequential(nodes);
  }
  res.json({ connections });
});

// POST /ai-workflow/generate/trigger
router.post("/ai-workflow/generate/trigger", (req: Request, res: Response) => {
  const { prompt } = req.body;
  let trigger;
  if (/webhook/i.test(prompt)) trigger = TriggerGenerator.generateWebhookTrigger(prompt);
  else if (/cron|schedule|every/i.test(prompt)) trigger = TriggerGenerator.generateCronTrigger(prompt);
  else trigger = TriggerGenerator.generateEventTrigger(prompt);
  res.json({ trigger });
});

export default router;
