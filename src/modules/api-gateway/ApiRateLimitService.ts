// src/modules/api-gateway/ApiRateLimitService.ts

interface ApiRateLimit {
  routeId: string;
  limit: number;
}

const rateLimits: ApiRateLimit[] = [];

export class ApiRateLimitService {
  setRateLimit(routeId: string, limit: number): void {
    const idx = rateLimits.findIndex(r => r.routeId === routeId);
    if (idx !== -1) {
      rateLimits[idx].limit = limit;
    } else {
      rateLimits.push({ routeId, limit });
    }
  }

  getRateLimit(routeId: string): number | undefined {
    return rateLimits.find(r => r.routeId === routeId)?.limit;
  }
}
