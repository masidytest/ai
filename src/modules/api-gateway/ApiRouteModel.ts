// src/modules/api-gateway/ApiRouteModel.ts

export interface ApiRoute {
  id: string;
  path: string;
  method: string;
  ownerId: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  rateLimit?: number;
  authRequired: boolean;
}

export const apiRoutes: ApiRoute[] = [];
