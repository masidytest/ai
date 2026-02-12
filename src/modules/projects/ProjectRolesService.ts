// src/modules/projects/ProjectRolesService.ts

interface ProjectRole {
  userId: string;
  projectId: string;
  role: string;
}

const projectRoles: ProjectRole[] = [];

export class ProjectRolesService {
  assignRole(projectId: string, userId: string, role: string): void {
    const idx = projectRoles.findIndex(r => r.projectId === projectId && r.userId === userId);
    if (idx !== -1) {
      projectRoles[idx].role = role;
    } else {
      projectRoles.push({ projectId, userId, role });
    }
  }

  getRole(projectId: string, userId: string): string | null {
    const entry = projectRoles.find(r => r.projectId === projectId && r.userId === userId);
    return entry ? entry.role : null;
  }

  listRoles(projectId: string): ProjectRole[] {
    return projectRoles.filter(r => r.projectId === projectId);
  }
}
