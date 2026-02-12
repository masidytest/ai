import { Request, Response } from 'express';
import { HostingService } from './hosting.service';

export class HostingController {
  static listSites(_req: Request, res: Response) {
    const sites = HostingService.listSites();
    res.json(sites);
  }

  static createSite(req: Request, res: Response) {
    const { domain, plan } = req.body;
    if (!domain || !plan) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const site = HostingService.createSite({ domain, plan });
    res.status(201).json(site);
  }

  static deleteSite(req: Request, res: Response) {
    const { id } = req.params;
    const ok = HostingService.deleteSite(id);
    if (!ok) return res.status(404).json({ error: 'Site not found' });
    res.status(204).send();
  }
}
