// src/modules/audit/AuditLogService.ts

import { AuditLog, auditLogs } from './AuditLogModel';
import { v4 as uuidv4 } from 'uuid';

export class AuditLogService {
  log(userId: string, type: AuditLog['type'], action: string, projectId?: string, details?: Record<string, any>): AuditLog {
    const entry: AuditLog = {
      id: uuidv4(),
      userId,
      projectId,
      type,
      action,
      timestamp: new Date(),
      details,
    };
    auditLogs.push(entry);
    return entry;
  }

  query(filters: {
    userId?: string;
    type?: AuditLog['type'];
    projectId?: string;
    from?: Date;
    to?: Date;
  }): AuditLog[] {
    return auditLogs.filter(log => {
      if (filters.userId && log.userId !== filters.userId) return false;
      if (filters.type && log.type !== filters.type) return false;
      if (filters.projectId && log.projectId !== filters.projectId) return false;
      if (filters.from && log.timestamp < filters.from) return false;
      if (filters.to && log.timestamp > filters.to) return false;
      return true;
    });
  }
}
