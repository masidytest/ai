// src/modules/projects/ProjectActivityLogService.ts

interface ProjectActivityLog {
  id: string;
  projectId: string;
  userId: string;
  action: string;
  timestamp: Date;
  details?: Record<string, any>;
}

const activityLogs: ProjectActivityLog[] = [];

import { v4 as uuidv4 } from 'uuid';

export class ProjectActivityLogService {
  log(projectId: string, userId: string, action: string, details?: Record<string, any>): void {
    activityLogs.push({
      id: uuidv4(),
      projectId,
      userId,
      action,
      timestamp: new Date(),
      details,
    });
  }

  listLogs(projectId: string): ProjectActivityLog[] {
    return activityLogs.filter(l => l.projectId === projectId);
  }
}
