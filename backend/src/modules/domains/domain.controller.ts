import { Request, Response } from 'express';
import { DomainService } from './domain.service';

export class DomainController {
  static listDomains(_req: Request, res: Response) {
    const all = DomainService.listDomains();
    res.json(all);
  }

  static registerDomain(req: Request, res: Response) {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing domain name' });
    const domain = DomainService.registerDomain(name);
    res.status(201).json(domain);
  }

  static updateDNS(req: Request, res: Response) {
    const { id } = req.params;
    const dns = req.body;
    const ok = DomainService.updateDNS(id, dns);
    if (!ok) return res.status(404).json({ error: 'Domain not found' });
    res.status(204).send();
  }
}
