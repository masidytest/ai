// AiCloudAssistantService: Stubs for AI-powered cloud suggestions

export class AiCloudAssistantService {
  async suggestPlan(prompt: string): Promise<string> {
    // Stub: pick plan based on keywords
    if (/large|heavy|enterprise/i.test(prompt)) return "medium";
    if (/small|basic|starter/i.test(prompt)) return "nano";
    if (/api|web|node/i.test(prompt)) return "micro";
    return "small";
  }

  async suggestRegion(prompt: string): Promise<string> {
    // Stub: pick region based on keywords
    if (/europe|germany|frankfurt/i.test(prompt)) return "eu-central";
    if (/asia|india|singapore/i.test(prompt)) return "asia-south";
    if (/west|california|seattle/i.test(prompt)) return "us-west";
    return "us-east";
  }

  async generateServerConfig(prompt: string): Promise<any> {
    // Stub: return config object
    return {
      name: prompt.replace(/[^a-zA-Z0-9]/g, "-").slice(0, 16) || "ai-server",
      plan: await this.suggestPlan(prompt),
      region: await this.suggestRegion(prompt),
    };
  }

  async explainServerStatus(server: any): Promise<string> {
    // Stub: explain status
    switch (server.status) {
      case "creating": return "The server is being provisioned. This may take a few minutes.";
      case "running": return "The server is online and ready to use.";
      case "stopped": return "The server is currently stopped. Start it to resume operations.";
      case "error": return "There was an error with this server. Please check logs or contact support.";
      default: return "Unknown status.";
    }
  }
}
