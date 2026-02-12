export type Intent =
  | 'cloud'
  | 'hosting'
  | 'domains'
  | 'workflows'
  | 'builder'
  | 'ai-ide'
  | 'deploy'
  | 'database'
  | 'billing'
  | 'settings'
  | 'dashboard'
  | 'unknown';

export interface RoutingResult {
  intent: Intent;
  confidence: number;
  redirect: string;
  metadata?: Record<string, any>;
}

const intentRedirects: Record<Intent, string> = {
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
  unknown: '/dashboard',
};

export class AiRoutingEngineService {
  static classifyPrompt(prompt: string): RoutingResult {
    const p = prompt.toLowerCase();
    let intent: Intent = 'unknown';
    let confidence = 0.5;
    if (p.includes('cloud')) { intent = 'cloud'; confidence = 0.95; }
    else if (p.includes('host')) { intent = 'hosting'; confidence = 0.93; }
    else if (p.includes('domain')) { intent = 'domains'; confidence = 0.93; }
    else if (p.includes('workflow')) { intent = 'workflows'; confidence = 0.93; }
    else if (p.includes('builder')) { intent = 'builder'; confidence = 0.93; }
    else if (p.includes('ide')) { intent = 'ai-ide'; confidence = 0.93; }
    else if (p.includes('deploy')) { intent = 'deploy'; confidence = 0.93; }
    else if (p.includes('database')) { intent = 'database'; confidence = 0.93; }
    else if (p.includes('bill')) { intent = 'billing'; confidence = 0.93; }
    else if (p.includes('setting')) { intent = 'settings'; confidence = 0.93; }
    else if (p.includes('dashboard')) { intent = 'dashboard'; confidence = 0.93; }
    return {
      intent,
      confidence,
      redirect: intentRedirects[intent],
      metadata: {},
    };
  }
}
