import { Request, Response } from 'express';
import { CloudService } from './cloud.service';

export class CloudController {
  static listServers(_req: Request, res: Response) {
    const servers = CloudService.listServers();
    res.json(servers);
  }

  static createServer(req: Request, res: Response) {
    const { name, region, size } = req.body;
    if (!name || !region || !size) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const server = CloudService.createServer({ name, region, size });
    res.status(201).json(server);
  }

  static deleteServer(req: Request, res: Response) {
    const { id } = req.params;
    const ok = CloudService.deleteServer(id);
    if (!ok) return res.status(404).json({ error: 'Server not found' });
    res.status(204).send();
  }
}
