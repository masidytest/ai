// HostingDeployService.ts

interface DeployLog {
  timestamp: Date;
  message: string;
}

const deployLogs: Record<string, DeployLog[]> = {};
const deployStatus: Record<string, "idle" | "deploying" | "success" | "error"> = {};

export class HostingDeployService {
  async deployFromRepo(siteId: string, repoUrl: string): Promise<boolean> {
    deployStatus[siteId] = "deploying";
    deployLogs[siteId] = [
      { timestamp: new Date(), message: `Cloning repo: ${repoUrl}` },
    ];
    // Simulate git clone
    await new Promise((res) => setTimeout(res, 800));
    deployLogs[siteId].push({ timestamp: new Date(), message: "Repo cloned." });
    // Simulate build
    await new Promise((res) => setTimeout(res, 1000));
    deployLogs[siteId].push({ timestamp: new Date(), message: "Build completed." });
    // Simulate deploy
    await new Promise((res) => setTimeout(res, 800));
    deployLogs[siteId].push({ timestamp: new Date(), message: "Deployed to production." });
    deployStatus[siteId] = "success";
    return true;
  }

  async getDeployLogs(siteId: string): Promise<string[]> {
    return (deployLogs[siteId] || []).map(l => `[${l.timestamp.toLocaleTimeString()}] ${l.message}`);
  }

  async getDeployStatus(siteId: string): Promise<"idle" | "deploying" | "success" | "error"> {
    return deployStatus[siteId] || "idle";
  }
}
