// src/modules/projects/ProjectModel.ts

export interface Project {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  settings: Record<string, any>;
  members: string[];
}

export const projects: Project[] = [];
