// src/modules/database/DatabaseController.ts
import { Router, Request, Response } from 'express';
import { databaseInstances } from './DatabaseInstanceModel';
import { DatabaseProvisioningService } from './DatabaseProvisioningService';
import { DatabaseSchemaService } from './DatabaseSchemaService';
import { DatabaseQueryService } from './DatabaseQueryService';
import { DatabaseBackupService } from './DatabaseBackupService';
import { DatabaseBranchingService } from './DatabaseBranchingService';

const router = Router();

// GET /databases
router.get('/databases', (req: Request, res: Response) => {
  res.json(databaseInstances);
});

// POST /databases
router.post('/databases', async (req: Request, res: Response) => {
  const { name, provider, region } = req.body;
  const db = await DatabaseProvisioningService.createDatabase({ name, provider, region });
  res.json(db);
});

// GET /databases/:id
router.get('/databases/:id', (req: Request, res: Response) => {
  const db = databaseInstances.find(d => d.id === req.params.id);
  if (!db) return res.status(404).json({ error: 'Not found' });
  res.json(db);
});

// DELETE /databases/:id
router.delete('/databases/:id', async (req: Request, res: Response) => {
  const deleted = await DatabaseProvisioningService.deleteDatabase(req.params.id);
  res.json({ success: deleted });
});

// GET /databases/:id/schema
router.get('/databases/:id/schema', async (req: Request, res: Response) => {
  const tables = await DatabaseSchemaService.getTables(req.params.id);
  res.json(tables);
});

// GET /databases/:id/schema/:table
router.get('/databases/:id/schema/:table', async (req: Request, res: Response) => {
  const columns = await DatabaseSchemaService.getColumns(req.params.id, req.params.table);
  res.json(columns);
});

// POST /databases/:id/query
router.post('/databases/:id/query', async (req: Request, res: Response) => {
  const { sql } = req.body;
  const result = await DatabaseQueryService.runQuery(req.params.id, sql);
  res.json(result);
});

// GET /databases/:id/backups
router.get('/databases/:id/backups', async (req: Request, res: Response) => {
  const backups = await DatabaseBackupService.listBackups(req.params.id);
  res.json(backups);
});

// POST /databases/:id/backups
router.post('/databases/:id/backups', async (req: Request, res: Response) => {
  const backup = await DatabaseBackupService.createBackup(req.params.id);
  res.json(backup);
});

// POST /databases/:id/backups/:backupId/restore
router.post('/databases/:id/backups/:backupId/restore', async (req: Request, res: Response) => {
  const backup = await DatabaseBackupService.restoreBackup(req.params.id, req.params.backupId);
  if (!backup) return res.status(404).json({ error: 'Backup not found' });
  res.json(backup);
});

// GET /databases/:id/branches
router.get('/databases/:id/branches', async (req: Request, res: Response) => {
  const branches = await DatabaseBranchingService.listBranches(req.params.id);
  res.json(branches);
});

// POST /databases/:id/branches
router.post('/databases/:id/branches', async (req: Request, res: Response) => {
  const { name } = req.body;
  const branch = await DatabaseBranchingService.createBranch(req.params.id, name);
  res.json(branch);
});

// POST /databases/:id/branches/:branch/merge
router.post('/databases/:id/branches/:branch/merge', async (req: Request, res: Response) => {
  const merged = await DatabaseBranchingService.mergeBranch(req.params.id, req.params.branch);
  if (!merged) return res.status(404).json({ error: 'Branch not found' });
  res.json(merged);
});

export default router;
