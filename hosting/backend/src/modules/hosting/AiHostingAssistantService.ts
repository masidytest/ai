// AiHostingAssistantService.ts
// Stub AI logic for hosting suggestions and explanations

export class AiHostingAssistantService {
  async suggestSiteNames(prompt: string): Promise<string[]> {
    const base = prompt.replace(/\s+/g, "").toLowerCase();
    return [
      `${base}site`,
      `get${base}`,
      `${base}cloud`,
      `${base}web`,
      `${base}host`,
    ];
  }
  async explainDnsLink(domain: string): Promise<string> {
    return `DNS linking connects your domain (${domain}) to your hosting server.`;
  }
  async explainSsl(domain: string): Promise<string> {
    return `SSL secures your site (${domain}) with HTTPS.`;
  }
  async explainEmail(domain: string): Promise<string> {
    return `Email hosting lets you use addresses like info@${domain}.`;
  }
}
