import express from "express";
import { DomainModel } from "./DomainModel";
import { DomainSearchService } from "./DomainSearchService";
import { DomainRegistrationService } from "./DomainRegistrationService";
import { DomainDnsService } from "./DomainDnsService";
import { DomainWhoisService } from "./DomainWhoisService";
import { DomainRenewalService } from "./DomainRenewalService";

const router = express.Router();
const model = new DomainModel();
const search = new DomainSearchService();
const reg = new DomainRegistrationService();
const dns = new DomainDnsService();
const whois = new DomainWhoisService();
const renewal = new DomainRenewalService();

// GET /domains
router.get("/domains", (req, res) => {
  res.json(model.getAll());
});

// POST /domains/search
router.post("/domains/search", async (req, res) => {
  const { name } = req.body;
  const result = await search.searchDomain(name);
  const alternatives = await search.suggestAlternatives(name);
  res.json({ result, alternatives });
});

// POST /domains/register
router.post("/domains/register", async (req, res) => {
  const { name, userId } = req.body;
  const domain = await reg.registerDomain(name, userId);
  res.json(domain);
});

// GET /domains/:id
router.get("/domains/:id", (req, res) => {
  const domain = model.getById(req.params.id);
  if (!domain) return res.status(404).json({ error: "Not found" });
  res.json(domain);
});

// GET /domains/:id/dns
router.get("/domains/:id/dns", (req, res) => {
  res.json(dns.getDnsRecords(req.params.id));
});

// POST /domains/:id/dns
router.post("/domains/:id/dns", (req, res) => {
  const record = dns.addDnsRecord(req.params.id, req.body);
  if (!record) return res.status(404).json({ error: "Domain not found" });
  res.json(record);
});

// PUT /domains/:id/dns/:recordId
router.put("/domains/:id/dns/:recordId", (req, res) => {
  const record = dns.updateDnsRecord(req.params.id, req.params.recordId, req.body);
  if (!record) return res.status(404).json({ error: "Record not found" });
  res.json(record);
});

// DELETE /domains/:id/dns/:recordId
router.delete("/domains/:id/dns/:recordId", (req, res) => {
  const ok = dns.deleteDnsRecord(req.params.id, req.params.recordId);
  res.json({ success: ok });
});

// GET /domains/:id/whois
router.get("/domains/:id/whois", async (req, res) => {
  const domain = model.getById(req.params.id);
  if (!domain) return res.status(404).json({ error: "Not found" });
  const data = await whois.lookup(domain.name);
  res.json(data);
});

// POST /domains/:id/renew
router.post("/domains/:id/renew", async (req, res) => {
  const ok = await renewal.renewDomain(req.params.id);
  res.json({ success: ok });
});

export default router;
