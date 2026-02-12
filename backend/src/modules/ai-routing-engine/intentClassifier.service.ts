export interface IntentDefinition {
  label: string;
  keywords: string[];
  patterns?: RegExp[];
  examples?: string[];
}

export interface IntentResult {
  intent: string;
  confidence: number;
}

const defaultIntents: IntentDefinition[] = [
  {
    label: 'cloud',
    keywords: ['cloud', 'server', 'vps', 'compute', 'instance', 'deploy server'],
    patterns: [/cloud/i, /server/i, /vps/i, /compute/i, /instance/i, /deploy server/i],
    examples: ['Create a new server', 'Deploy a VPS'],
  },
  {
    label: 'hosting',
    keywords: ['hosting', 'shared hosting', 'cpanel', 'site'],
    patterns: [/hosting/i, /shared hosting/i, /cpanel/i, /site/i],
    examples: ['Set up shared hosting', 'Access cPanel'],
  },
  {
    label: 'domains',
    keywords: ['domain', 'dns', 'register', 'nameserver'],
    patterns: [/domain/i, /dns/i, /register/i, /nameserver/i],
    examples: ['Register a domain', 'Update DNS'],
  },
  {
    label: 'workflows',
    keywords: ['automation', 'workflow', 'trigger', 'node'],
    patterns: [/automation/i, /workflow/i, /trigger/i, /node/i],
    examples: ['Create a workflow', 'Add automation node'],
  },
  {
    label: 'builder',
    keywords: ['ui', 'drag', 'dashboard', 'interface'],
    patterns: [/ui/i, /drag/i, /dashboard/i, /interface/i],
    examples: ['Drag UI components', 'Build dashboard interface'],
  },
  {
    label: 'ai-ide',
    keywords: ['code', 'editor', 'generate code', 'refactor'],
    patterns: [/code/i, /editor/i, /generate code/i, /refactor/i],
    examples: ['Generate code', 'Refactor this function'],
  },
  {
    label: 'deploy',
    keywords: ['deploy', 'publish', 'release'],
    patterns: [/deploy/i, /publish/i, /release/i],
    examples: ['Deploy my app', 'Publish release'],
  },
  {
    label: 'database',
    keywords: ['db', 'sql', 'table', 'schema'],
    patterns: [/db/i, /sql/i, /table/i, /schema/i, /database/i],
    examples: ['Create SQL table', 'Edit schema'],
  },
  {
    label: 'billing',
    keywords: ['invoice', 'payment', 'subscription'],
    patterns: [/invoice/i, /payment/i, /subscription/i, /bill/i, /billing/i],
    examples: ['View invoices', 'Update payment method'],
  },
  {
    label: 'settings',
    keywords: ['profile', 'security', 'api key'],
    patterns: [/profile/i, /security/i, /api key/i, /setting/i],
    examples: ['Change profile', 'Update security settings'],
  },
  {
    label: 'dashboard',
    keywords: ['home', 'overview', 'dashboard'],
    patterns: [/home/i, /overview/i, /dashboard/i],
    examples: ['Go to dashboard', 'Show overview'],
  },
];

export class IntentClassifier {
  private intents: IntentDefinition[];

  constructor(intents: IntentDefinition[] = defaultIntents) {
    this.intents = intents;
  }

  classify(text: string): IntentResult {
    const lower = text.toLowerCase();
    let best: IntentResult = { intent: 'unknown', confidence: 0.5 };
    let bestScore = 0.5;
    for (const intent of this.intents) {
      let score = 0;
      // Rule-based: regex patterns (strong match)
      if (intent.patterns && intent.patterns.some(r => r.test(text))) {
        score += 0.7;
      }
      // Keyword frequency scoring
      if (intent.keywords) {
        let freq = 0;
        for (const k of intent.keywords) {
          const re = new RegExp(`\\b${k.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
          const matches = lower.match(re);
          if (matches) freq += matches.length;
        }
        if (freq > 0) score += Math.min(0.5, 0.1 * freq); // up to +0.5
      }
      // Semantic similarity placeholder (example phrase substring)
      if (intent.examples && intent.examples.some(e => lower.includes(e.toLowerCase()))) {
        score += 0.2;
      }
      if (score > bestScore) {
        best = { intent: intent.label, confidence: Math.min(0.99, 0.5 + score) };
        bestScore = score;
      }
    }
    return best;
  }

  addIntent(intent: IntentDefinition) {
    this.intents.push(intent);
  }
}
