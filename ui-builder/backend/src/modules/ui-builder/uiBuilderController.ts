import { Router } from "express";
import { UiBuilderService } from "./UiBuilderService";

export const UiBuilderController = Router();

UiBuilderController.get("/apps", (req, res) => {
  if (typeof UiBuilderService.listApps === "function") {
    res.json(UiBuilderService.listApps());
  } else {
    res.json([]);
  }
});

UiBuilderController.post("/apps", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const app = UiBuilderService.createApp(name);
  res.status(201).json(app);
});

UiBuilderController.get("/apps/:id", (req, res) => {
  const app = UiBuilderService.getApp(req.params.id);
  if (!app) return res.status(404).json({ error: "Not found" });
  res.json(app);
});

UiBuilderController.put("/apps/:id", (req, res) => {
  const updated = UiBuilderService.updateApp(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: "Not found" });
  res.json(updated);
});

UiBuilderController.delete("/apps/:id", (req, res) => {
  const ok = UiBuilderService.deleteApp(req.params.id);
  if (!ok) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

UiBuilderController.post("/apps/:id/publish", (req, res) => {
  const published = UiBuilderService.publishApp(req.params.id);
  if (!published) return res.status(404).json({ error: "Not found" });
  res.json(published);
});
import { Router } from "express";
import { AppModel } from "./AppModel";
import { ComponentSchemaRegistry } from "./ComponentSchemaRegistry";
import { validateAppModel } from "./validation";
import { aiGenerateUI } from "./aiAssist";

const apps: Record<string, AppModel> = {};
const registry = new ComponentSchemaRegistry();

export const uiBuilderRouter = Router();

// CRUD routes
uiBuilderRouter.get("/apps", (req, res) => {
  res.json(Object.values(apps));
});

uiBuilderRouter.get("/apps/:id", (req, res) => {
  const app = apps[req.params.id];
  if (!app) return res.status(404).json({ error: "Not found" });
  res.json(app);
});

uiBuilderRouter.post("/apps", (req, res) => {
  const app: AppModel = req.body;
  const errors = validateAppModel(app);
  if (errors.length) return res.status(400).json({ errors });
  apps[app.id] = app;
  res.status(201).json(app);
});

uiBuilderRouter.put("/apps/:id", (req, res) => {
  const app: AppModel = req.body;
  const errors = validateAppModel(app);
  if (errors.length) return res.status(400).json({ errors });
  apps[req.params.id] = app;
  res.json(app);
});

uiBuilderRouter.delete("/apps/:id", (req, res) => {
  delete apps[req.params.id];
  res.status(204).end();
});

// Publish endpoint
uiBuilderRouter.post("/apps/:id/publish", (req, res) => {
  const app = apps[req.params.id];
  if (!app) return res.status(404).json({ error: "Not found" });
  app.published = true;
  res.json({ success: true });
});

// Component schema registry
uiBuilderRouter.get("/schemas", (req, res) => {
  res.json(registry.getAllSchemas());
});

uiBuilderRouter.post("/schemas", (req, res) => {
  registry.register(req.body);
  res.status(201).json({ success: true });
});

// AI-assisted UI generation
uiBuilderRouter.post("/ai-generate", async (req, res) => {
  const { prompt } = req.body;
  const result = await aiGenerateUI(prompt);
  res.json(result);
});
