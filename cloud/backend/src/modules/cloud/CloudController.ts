import express from "express";
import { CloudProvisioningService } from "./CloudProvisioningService";
import { CloudMonitoringService } from "./CloudMonitoringService";
import { CloudDeployService } from "./CloudDeployService";

const router = express.Router();
const provision = new CloudProvisioningService();
const monitor = new CloudMonitoringService();
const deploy = new CloudDeployService();

// GET /cloud/servers
router.get("/servers", async (req, res) => {
  const servers = await provision.listServers();
  res.json(servers);
});

// POST /cloud/servers
router.post("/servers", async (req, res) => {
  const { name, region, plan } = req.body;
  const server = await provision.createServer(name, region, plan);
  res.json(server);
});

// GET /cloud/servers/:id
router.get("/servers/:id", async (req, res) => {
  const server = await provision.getServer(req.params.id);
  if (!server) return res.status(404).json({ error: "Not found" });
  res.json(server);
});

// DELETE /cloud/servers/:id
router.delete("/servers/:id", async (req, res) => {
  const ok = await provision.deleteServer(req.params.id);
  res.json({ success: ok });
});

// POST /cloud/servers/:id/start
router.post("/servers/:id/start", async (req, res) => {
  const server = await provision.startServer(req.params.id);
  if (!server) return res.status(404).json({ error: "Not found" });
  res.json(server);
});

// POST /cloud/servers/:id/stop
router.post("/servers/:id/stop", async (req, res) => {
  const server = await provision.stopServer(req.params.id);
  if (!server) return res.status(404).json({ error: "Not found" });
  res.json(server);
});

// POST /cloud/servers/:id/restart
router.post("/servers/:id/restart", async (req, res) => {
  const server = await provision.restartServer(req.params.id);
  if (!server) return res.status(404).json({ error: "Not found" });
  res.json(server);
});

// GET /cloud/servers/:id/metrics
router.get("/servers/:id/metrics", async (req, res) => {
  const metrics = await monitor.getMetrics(req.params.id);
  res.json(metrics);
});

// POST /cloud/servers/:id/deploy
router.post("/servers/:id/deploy", async (req, res) => {
  const { repoUrl } = req.body;
  await deploy.deployApp(req.params.id, repoUrl);
  res.json({ success: true });
});

// GET /cloud/servers/:id/deploy/logs
router.get("/servers/:id/deploy/logs", async (req, res) => {
  const logs = await deploy.getDeploymentLogs(req.params.id);
  res.json({ logs });
});

export default router;
