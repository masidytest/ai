// src/modules/projects/ProjectService.ts

import { v4 as uuidv4 } from 'uuid';
import { Project, projects } from './ProjectModel';

export class ProjectService {
  /** Create a new project */
  createProject(name: string, ownerId: string, settings: Record<string, any> = {}): Project {
    const now = new Date();
    const project: Project = {
      id: uuidv4(),
      name,
      ownerId,
      createdAt: now,
      updatedAt: now,
      settings,
      members: [ownerId],
    };
    projects.push(project);
    return project;
  }

  /** Get a project by id */
  getProject(id: string): Project | undefined {
    return projects.find(p => p.id === id);
  }

  /** List all projects for a user */
  listProjects(userId: string): Project[] {
    return projects.filter(p => p.ownerId === userId || p.members.includes(userId));
  }

  /** Update a project */
  updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'createdAt'>>): Project | undefined {
    const project = this.getProject(id);
    if (!project) return undefined;
    Object.assign(project, updates, { updatedAt: new Date() });
    return project;
  }

  /** Delete a project */
  deleteProject(id: string): void {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) projects.splice(idx, 1);
  }
}
