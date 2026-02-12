// HostingController.ts
import express from "express";
import { HostingSiteModel } from "./HostingSiteModel";
import { HostingProvisioningService } from "./HostingProvisioningService";
import { HostingDnsLinkService } from "./HostingDnsLinkService";
import { HostingSslService } from "./HostingSslService";
import { HostingEmailService } from "./HostingEmailService";
import { HostingDeployService } from "./HostingDeployService";

const router = express.Router();
const provisioning = new HostingProvisioningService();
const dns = new HostingDnsLinkService();
const ssl = new HostingSslService();
const email = new HostingEmailService();
const deploy = new HostingDeployService();

// GET /hosting/sites
router.get("/hosting/sites", async (req, res) => {
  res.json(await HostingSiteModel.findAll());
});

// POST /hosting/sites
router.post("/hosting/sites", async (req, res) => {
  const { domain, plan } = req.body;
  const site = await provisioning.createSite(domain, plan);
  res.status(201).json(site);
});

// GET /hosting/sites/:id
router.get("/hosting/sites/:id", async (req, res) => {
  const site = await HostingSiteModel.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Not found" });
  res.json(site);
});

// DELETE /hosting/sites/:id
router.delete("/hosting/sites/:id", async (req, res) => {
  const ok = await provisioning.deleteSite(req.params.id);
  res.json({ success: ok });
});

// POST /hosting/sites/:id/dns/check
router.post("/hosting/sites/:id/dns/check", async (req, res) => {
  const site = await HostingSiteModel.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Not found" });
  res.json(await dns.checkDns(site.domain));
});

// POST /hosting/sites/:id/dns/verify
router.post("/hosting/sites/:id/dns/verify", async (req, res) => {
  const site = await HostingSiteModel.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Not found" });
  res.json(await dns.verifyPropagation(site.domain));
});

// POST /hosting/sites/:id/ssl/enable
router.post("/hosting/sites/:id/ssl/enable", async (req, res) => {
  await ssl.enableSsl(req.params.id);
  res.json({ success: true });
});

// POST /hosting/sites/:id/ssl/disable
router.post("/hosting/sites/:id/ssl/disable", async (req, res) => {
  await ssl.disableSsl(req.params.id);
  res.json({ success: true });
});

// GET /hosting/sites/:id/email
router.get("/hosting/sites/:id/email", async (req, res) => {
  res.json(await email.listEmailAccounts(req.params.id));
});

// POST /hosting/sites/:id/email
router.post("/hosting/sites/:id/email", async (req, res) => {
  const { address, password } = req.body;
  const acc = await email.createEmailAccount(req.params.id, address, password);
  res.status(201).json(acc);
});

// DELETE /hosting/sites/:id/email/:address
router.delete("/hosting/sites/:id/email/:address", async (req, res) => {
  const ok = await email.deleteEmailAccount(req.params.id, req.params.address);
  res.json({ success: ok });
});

// POST /hosting/sites/:id/deploy
router.post("/hosting/sites/:id/deploy", async (req, res) => {
  const { repoUrl } = req.body;
  await deploy.deployFromRepo(req.params.id, repoUrl);
  res.json({ success: true });
});

// GET /hosting/sites/:id/deploy/logs
router.get("/hosting/sites/:id/deploy/logs", async (req, res) => {
  res.json(await deploy.getDeployLogs(req.params.id));
});

export default router;
