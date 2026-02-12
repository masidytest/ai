"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Simple chart stub (replace with real chart lib as needed)
function MetricChart({ label, data, color }: { label: string; data: number[]; color: string }) {
  return (
    <div className="flex flex-col items-start mb-2">
      <span className="text-xs text-[#a259ff] mb-1">{label}</span>
      <div className="w-full h-16 bg-[#232347] rounded relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 100 32" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((v, i) => `${i * (100 / (data.length - 1))},${32 - (v / Math.max(...data, 1)) * 28}`).join(" ")}
          />
        </svg>
      </div>
    </div>
  );
}

export default function ServerDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [server, setServer] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [deploying, setDeploying] = useState(false);
  const [deployUrl, setDeployUrl] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchServer() {
    setLoading(true);
    const res = await fetch(`/api/cloud/servers/${id}`);
    setServer(await res.json());
    setLoading(false);
  }
  async function fetchMetrics() {
    const res = await fetch(`/api/cloud/servers/${id}/metrics`);
    setMetrics(m => [...m.slice(-19), await res.json()]);
  }
  async function fetchLogs() {
    const res = await fetch(`/api/cloud/servers/${id}/deploy/logs`);
    setLogs((await res.json()).logs);
  }
  useEffect(() => {
    fetchServer();
    fetchMetrics();
    fetchLogs();
    const interval = setInterval(() => {
      fetchServer();
      fetchMetrics();
      fetchLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  async function handleAction(action: "start" | "stop" | "restart") {
    await fetch(`/api/cloud/servers/${id}/${action}`, { method: "POST" });
    fetchServer();
  }
  async function handleDeploy(e: React.FormEvent) {
    e.preventDefault();
    setDeploying(true);
    await fetch(`/api/cloud/servers/${id}/deploy`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repoUrl: deployUrl })
    });
    setDeploying(false);
    setDeployUrl("");
    fetchLogs();
  }

  if (loading || !server) return <div className="p-8 text-[#a259ff]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#10111a] text-white p-8">
      <div className="flex items-center gap-6 mb-6">
        <h1 className="text-2xl font-bold text-[#a259ff]">{server.name}</h1>
        <span className={`px-2 py-1 rounded text-xs font-bold ${server.status === "running" ? "bg-green-500 text-black" : server.status === "creating" ? "bg-yellow-500 text-black" : server.status === "stopped" ? "bg-gray-500 text-white" : "bg-red-500 text-white"}`}>{server.status}</span>
        <span className="text-sm text-[#00fff7] ml-4">{server.ipAddress || "-"}</span>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => handleAction("start")} disabled={server.status === "running"}>Start</Button>
          <Button onClick={() => handleAction("stop")} disabled={server.status !== "running"}>Stop</Button>
          <Button onClick={() => handleAction("restart")} disabled={server.status !== "running"}>Restart</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="bg-[#18192a] border border-[#232347] p-4">
          <h2 className="text-lg font-bold text-[#a259ff] mb-2">Metrics</h2>
          <MetricChart label="CPU Usage (%)" data={metrics.map(m => m.cpu)} color="#00fff7" />
          <MetricChart label="RAM (MB)" data={metrics.map(m => m.ram)} color="#a259ff" />
          <MetricChart label="Disk (GB)" data={metrics.map(m => m.disk)} color="#7c3aed" />
          <MetricChart label="Network In (MBps)" data={metrics.map(m => m.netIn)} color="#38bdf8" />
          <MetricChart label="Network Out (MBps)" data={metrics.map(m => m.netOut)} color="#f472b6" />
        </Card>
        <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col">
          <h2 className="text-lg font-bold text-[#a259ff] mb-2">Deploy App</h2>
          <form onSubmit={handleDeploy} className="flex gap-2 mb-4">
            <input
              className="flex-1 px-2 py-1 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
              placeholder="Git repo URL"
              value={deployUrl}
              onChange={e => setDeployUrl(e.target.value)}
              required
              disabled={deploying}
            />
            <Button type="submit" disabled={deploying || !deployUrl} className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">
              {deploying ? <span className="animate-spin mr-2">⏳</span> : null}Deploy
            </Button>
          </form>
          <h2 className="text-lg font-bold text-[#a259ff] mb-2 mt-4">Logs</h2>
          <div className="flex-1 overflow-y-auto bg-[#232347] rounded p-2 text-xs text-[#00fff7] max-h-64">
            {logs.length === 0 ? <span className="text-gray-400">No logs yet.</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </Card>
      </div>
    </div>
  );
}
