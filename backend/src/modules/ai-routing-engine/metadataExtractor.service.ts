export class MetadataExtractor {
  static extract(prompt: string): Record<string, any> {
    const meta: Record<string, any> = {};
    // Domain name
    const domainMatch = prompt.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (domainMatch) meta.domain = domainMatch[1].toLowerCase();
    // Server size (e.g., 2GB, 4GB, 8GB, 16GB)
    const sizeMatch = prompt.match(/(\d{1,2}GB)/i);
    if (sizeMatch) meta.serverSize = sizeMatch[1].toUpperCase();
    // Region (EU, US, Asia, etc.)
    const regionMatch = prompt.match(/\b(EU|US|Asia|APAC|EMEA|NA|SA|AFRICA)\b/i);
    if (regionMatch) meta.region = regionMatch[1].toUpperCase();
    // Workflow triggers (email, webhook)
    const triggerMatch = prompt.match(/\b(email|webhook|cron|timer|api call)\b/i);
    if (triggerMatch) meta.workflowTrigger = triggerMatch[1].toLowerCase();
    // UI components (table, form, chart, button, input)
    const components: string[] = [];
    const componentTypes = ['table', 'form', 'chart', 'button', 'input', 'list', 'card'];
    for (const type of componentTypes) {
      if (new RegExp(`\\b${type}\\b`, 'i').test(prompt)) {
        components.push(type);
      }
    }
    if (components.length) meta.uiComponents = components;
    return meta;
  }
}
