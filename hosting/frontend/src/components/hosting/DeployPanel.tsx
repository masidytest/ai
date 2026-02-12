"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DeployPanelProps {
  siteId: string;
}

export const DeployPanel: React.FC<DeployPanelProps> = ({ siteId }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState<string>("Idle");
  const [logs, setLogs] = useState<string>("");

  useEffect(() => {
    fetch(`/hosting/api/sites/${siteId}/deploy/status`)
      .then(res => res.json())
      .then(data => setStatus(data.status || "Idle"));
    fetch(`/hosting/api/sites/${siteId}/deploy/logs`)
      .then(res => res.json())
      .then(data => setLogs(data.logs || ""));
  }, [siteId]);

  async function handleDeploy() {
    setDeploying(true);
    setStatus("Deploying...");
    setLogs("");
    await fetch(`/hosting/api/sites/${siteId}/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl })
    });
    // Simulate polling for status/logs
    setTimeout(async () => {
      const statusRes = await fetch(`/hosting/api/sites/${siteId}/deploy/status`);
      const statusData = await statusRes.json();
      setStatus(statusData.status || "Idle");
      const logsRes = await fetch(`/hosting/api/sites/${siteId}/deploy/logs`);
      const logsData = await logsRes.json();
      setLogs(logsData.logs || "");
      setDeploying(false);
    }, 2000);
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col">
      <div className="font-semibold text-[#a259ff] mb-2">Deploy</div>
      <div className="flex gap-2 mb-4">
        <Input
          className="bg-[#232347] border-[#a259ff] text-[#00fff7]"
          placeholder="Git repo URL (https://...)"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          disabled={deploying}
        />
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          onClick={handleDeploy}
          disabled={deploying || !repoUrl}
        >
          Deploy
        </Button>
      </div>
      <div className="mb-2 text-[#00fff7]">Status: <span className="font-mono">{status}</span></div>
      <div className="bg-[#232347] rounded p-2 text-xs text-[#00fff7] h-40 overflow-y-auto font-mono whitespace-pre-wrap">
        {logs || "No logs yet."}
      </div>
    </Card>
  );
};
