import { IntentClassifier } from './intentClassifier.service';
import { RedirectMapper } from './redirectMapper.service';

export interface AiRoutingResult {
  intent: string;
  confidence: number;
  redirect: string;
  metadata: Record<string, any>;
}

export class AiRoutingService {
  private classifier: IntentClassifier;
  private redirectMapper: typeof RedirectMapper;

  constructor(classifier = new IntentClassifier(), redirectMapper = RedirectMapper) {
    this.classifier = classifier;
    this.redirectMapper = redirectMapper;
  }

  routePrompt(prompt: string): AiRoutingResult {
    const { intent, confidence } = this.classifier.classify(prompt);
    const redirect = this.redirectMapper.getRoute(intent);
    const metadata = this.extractMetadata(prompt, intent);
    return { intent, confidence, redirect, metadata };
  }

  // Example: extract server size, domain name, etc. (placeholder logic)
  private extractMetadata(prompt: string, intent: string): Record<string, any> {
    const meta: Record<string, any> = {};
    if (intent === 'cloud') {
      // Match numeric server size (e.g., 4GB, 8GB, 16GB, etc.)
      const sizeMatch = prompt.match(/(\d+\s*GB)/i);
      if (sizeMatch) meta.serverSize = sizeMatch[1].replace(/\s+/g, '').toUpperCase();
      else {
        // fallback to small/medium/large/xlarge
        const sizeWordMatch = prompt.match(/(small|medium|large|xlarge)/i);
        if (sizeWordMatch) meta.serverSize = sizeWordMatch[1].toLowerCase();
      }
      // Match region (e.g., EU, US, APAC, etc.)
      const regionMatch = prompt.match(/\b(EU|US|APAC|ASIA|AFRICA|NA|SA)\b/i);
      if (regionMatch) meta.region = regionMatch[1].toUpperCase();
    }
    if (intent === 'domains') {
      const domainMatch = prompt.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      if (domainMatch) meta.domain = domainMatch[1].toLowerCase();
    }
    // Add more extraction rules as needed
    return meta;
  }
}
