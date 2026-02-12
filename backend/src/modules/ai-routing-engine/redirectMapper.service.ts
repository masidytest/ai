const intentToRoute: Record<string, string> = {
  cloud: '/dashboard/cloud',
  hosting: '/dashboard/hosting',
  domains: '/dashboard/domains',
  workflows: '/dashboard/workflows',
  builder: '/dashboard/builder',
  'ai-ide': '/dashboard/ai-ide',
  deploy: '/dashboard/deploy',
  database: '/dashboard/database',
  billing: '/dashboard/billing',
  settings: '/dashboard/settings',
  dashboard: '/dashboard',
};

export class RedirectMapper {
  static getRoute(intent: string): string {
    return intentToRoute[intent] || '/dashboard';
  }
}
