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

// CRUD
router.get("/sites", async (req, res) => {
  res.json(await HostingSiteModel.findAll());
});
router.get("/sites/:id", async (req, res) => {
  const site = await HostingSiteModel.findById(req.params.id);
  if (!site) return res.status(404).json({ error: "Not found" });
  res.json(site);
});
router.post("/sites", async (req, res) => {
  const { name, domain } = req.body;
  const site = await provisioning.provisionSite({ name, domain });
  res.status(201).json(site);
});
router.put("/sites/:id", async (req, res) => {
  const site = await HostingSiteModel.update(req.params.id, req.body);
  if (!site) return res.status(404).json({ error: "Not found" });
  res.json(site);
});
router.delete("/sites/:id", async (req, res) => {
  const ok = await HostingSiteModel.delete(req.params.id);
  res.json({ success: ok });
});
// DNS
router.post("/sites/:id/dns/link", async (req, res) => {
  await dns.linkDns(req.params.id);
  res.json({ success: true });
});
router.post("/sites/:id/dns/unlink", async (req, res) => {
  await dns.unlinkDns(req.params.id);
  res.json({ success: true });
});
// SSL
router.post("/sites/:id/ssl/enable", async (req, res) => {
  await ssl.enableSsl(req.params.id);
  res.json({ success: true });
});
router.post("/sites/:id/ssl/disable", async (req, res) => {
  await ssl.disableSsl(req.params.id);
  res.json({ success: true });
});
// Email
router.post("/sites/:id/email/enable", async (req, res) => {
  await email.enableEmail(req.params.id);
  res.json({ success: true });
});
router.post("/sites/:id/email/disable", async (req, res) => {
  await email.disableEmail(req.params.id);
  res.json({ success: true });
});
// Deploy
router.post("/sites/:id/deploy", async (req, res) => {
  await deploy.deploy(req.params.id);
  res.json({ success: true });
});

export default router;
