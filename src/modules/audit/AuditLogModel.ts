// src/modules/audit/AuditLogModel.ts

export interface AuditLog {
  id: string;
  userId: string;
  projectId?: string;
  type: 'auth' | 'billing' | 'workflow' | 'cloud' | 'hosting' | 'domain' | 'database' | 'ide' | 'ui-builder';
  action: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export const auditLogs: AuditLog[] = [];
