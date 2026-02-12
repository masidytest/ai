// src/modules/projects/ProjectMembersService.ts

import { Project, projects } from './ProjectModel';

export class ProjectMembersService {
  addMember(projectId: string, userId: string): void {
    const project = projects.find(p => p.id === projectId);
    if (project && !project.members.includes(userId)) {
      project.members.push(userId);
    }
  }

  removeMember(projectId: string, userId: string): void {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      project.members = project.members.filter(id => id !== userId);
    }
  }

  listMembers(projectId: string): string[] {
    const project = projects.find(p => p.id === projectId);
    return project ? project.members : [];
  }
}
