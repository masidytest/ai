// src/modules/api-gateway/ApiAuthService.ts

import { ApiRoute } from './ApiRouteModel';

export class ApiAuthService {
  isAuthorized(route: ApiRoute, apiKey: string | null): boolean {
    // Stub: always return true for now
    return true;
  }
}
