// src/modules/projects/ProjectSettingsService.ts

import { Project, projects } from './ProjectModel';

export class ProjectSettingsService {
  getSettings(projectId: string): Record<string, any> | undefined {
    const project = projects.find(p => p.id === projectId);
    return project?.settings;
  }

  updateSettings(projectId: string, settings: Record<string, any>): void {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.settings = settings;
    }
  }
}
