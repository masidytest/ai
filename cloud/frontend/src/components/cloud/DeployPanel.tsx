"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface DeployPanelProps {
  serverId: string;
}

export const DeployPanel: React.FC<DeployPanelProps> = ({ serverId }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [deploying, setDeploying] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [logs, setLogs] = useState<string[]>([]);

  async function fetchStatus() {
    const res = await fetch(`/api/cloud/servers/${serverId}/deploy/logs`);
    const data = await res.json();
    setLogs(data.logs);
    // Optionally fetch status from a status endpoint if available
    const statusRes = await fetch(`/api/cloud/servers/${serverId}/deploy/status`).catch(() => null);
    if (statusRes && statusRes.ok) {
      setStatus((await statusRes.json()).status);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [serverId]);

  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    setDeploying(true);
    await fetch(`/api/cloud/servers/${serverId}/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl })
    });
    setDeploying(false);
    setRepoUrl("");
    fetchStatus();
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col">
      <h2 className="text-lg font-bold text-[#a259ff] mb-2">Deploy App</h2>
      <form onSubmit={handleDeploy} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-2 py-1 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
          placeholder="Git repo URL"
          value={repoUrl}
          onChange={e => setRepoUrl(e.target.value)}
          required
          disabled={deploying}
        />
        <Button type="submit" disabled={deploying || !repoUrl} className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">
          {deploying ? <span className="animate-spin mr-2">⏳</span> : null}Deploy
        </Button>
      </form>
      <div className="mb-2 text-xs text-[#a259ff]">Status: {status || "-"}</div>
      <h2 className="text-lg font-bold text-[#a259ff] mb-2 mt-4">Logs</h2>
      <div className="flex-1 overflow-y-auto bg-[#232347] rounded p-2 text-xs text-[#00fff7] max-h-64">
        {logs.length === 0 ? <span className="text-gray-400">No logs yet.</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </Card>
  );
};
