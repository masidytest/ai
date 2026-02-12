"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface CloudServer {
  id: string;
  name: string;
  region: string;
  plan: string;
  status: "creating" | "running" | "stopped" | "error";
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  creating: "bg-yellow-500 text-black",
  running: "bg-green-500 text-black",
  stopped: "bg-gray-500 text-white",
  error: "bg-red-500 text-white",
};

export default function CloudDashboard() {
  const [servers, setServers] = useState<CloudServer[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchServers() {
    setLoading(true);
    const res = await fetch("/api/cloud/servers");
    const data = await res.json();
    setServers(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchServers();
    const interval = setInterval(fetchServers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#10111a] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#a259ff]">Cloud Servers</h1>
        <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">Create Server</Button>
      </div>
      <Card className="w-full overflow-x-auto bg-[#18192a] border border-[#232347]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#232347]">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Region</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">IP Address</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {servers.map(server => (
              <Link href={`/cloud/servers/${server.id}`} key={server.id} legacyBehavior>
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-[#232347] hover:bg-[#232347] transition cursor-pointer"
                >
                  <td className="px-4 py-2 font-semibold">{server.name}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[server.status]}`}>{server.status}</span>
                  </td>
                  <td className="px-4 py-2">{server.region}</td>
                  <td className="px-4 py-2">{server.plan}</td>
                  <td className="px-4 py-2">{server.ipAddress || <span className="text-gray-500">-</span>}</td>
                  <td className="px-4 py-2">{new Date(server.createdAt).toLocaleString()}</td>
                </motion.tr>
              </Link>
            ))}
            {servers.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-8">No servers found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-4 text-[#a259ff] text-center">Loading...</div>}
      </Card>
    </div>
  );
}
