export type Intent = 'cloud' | 'hosting' | 'domains' | 'workflows' | 'builder' | 'ai-ide' | 'billing' | 'unknown';

export interface RouteResult {
  target: string;
  intent: Intent;
  metadata?: Record<string, any>;
}

export interface IntentClassifier {
  classify(prompt: string): Promise<Intent>;
}

// Placeholder classifier
class SimpleIntentClassifier implements IntentClassifier {
  async classify(prompt: string): Promise<Intent> {
    const p = prompt.toLowerCase();
    if (p.includes('cloud')) return 'cloud';
    if (p.includes('host')) return 'hosting';
    if (p.includes('domain')) return 'domains';
    if (p.includes('workflow')) return 'workflows';
    if (p.includes('builder')) return 'builder';
    if (p.includes('ide')) return 'ai-ide';
    if (p.includes('bill')) return 'billing';
    return 'unknown';
  }
}

export class AiRouterService {
  private classifier: IntentClassifier;
  constructor(classifier: IntentClassifier = new SimpleIntentClassifier()) {
    this.classifier = classifier;
  }

  async routePrompt(prompt: string): Promise<RouteResult> {
    const intent = await this.classifier.classify(prompt);
    let target = '/';
    switch (intent) {
      case 'cloud': target = '/dashboard/cloud'; break;
      case 'hosting': target = '/dashboard/hosting'; break;
      case 'domains': target = '/dashboard/domains'; break;
      case 'workflows': target = '/dashboard/workflows'; break;
      case 'builder': target = '/dashboard/builder'; break;
      case 'ai-ide': target = '/dashboard/ai-ide'; break;
      case 'billing': target = '/dashboard/billing'; break;
      default: target = '/dashboard';
    }
    return { target, intent };
  }
}
