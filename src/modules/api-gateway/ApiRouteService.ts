// src/modules/api-gateway/ApiRouteService.ts

import { ApiRoute, apiRoutes } from './ApiRouteModel';
import { v4 as uuidv4 } from 'uuid';

export class ApiRouteService {
  createRoute(path: string, method: string, ownerId: string, projectId?: string, rateLimit?: number, authRequired: boolean = true): ApiRoute {
    const now = new Date();
    const route: ApiRoute = {
      id: uuidv4(),
      path,
      method,
      ownerId,
      projectId,
      createdAt: now,
      updatedAt: now,
      rateLimit,
      authRequired,
    };
    apiRoutes.push(route);
    return route;
  }

  getRoute(id: string): ApiRoute | undefined {
    return apiRoutes.find(r => r.id === id);
  }

  listRoutes(projectId?: string): ApiRoute[] {
    return projectId ? apiRoutes.filter(r => r.projectId === projectId) : apiRoutes;
  }

  updateRoute(id: string, updates: Partial<Omit<ApiRoute, 'id' | 'createdAt'>>): ApiRoute | undefined {
    const route = this.getRoute(id);
    if (!route) return undefined;
    Object.assign(route, updates, { updatedAt: new Date() });
    return route;
  }

  deleteRoute(id: string): void {
    const idx = apiRoutes.findIndex(r => r.id === id);
    if (idx !== -1) apiRoutes.splice(idx, 1);
  }
}
