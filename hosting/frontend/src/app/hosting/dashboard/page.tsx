"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface HostingSite {
  id: string;
  domain: string;
  status: "creating" | "active" | "error";
  plan: string;
  ftpCredentials?: { user: string; password: string };
  sslEnabled?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HostingDashboard() {
  const [sites, setSites] = useState<HostingSite[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  async function fetchSites() {
    setLoading(true);
    const res = await fetch("/hosting/api/sites");
    setSites(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchSites();
    const interval = setInterval(fetchSites, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#10111a] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#a259ff]">Hosting Sites</h1>
        <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => setShowCreate(true)}>
          Create Site
        </Button>
      </div>
      <Card className="w-full overflow-x-auto bg-[#18192a] border border-[#232347]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#232347]">
              <th className="px-4 py-2 text-left">Domain</th>
              <th className="px-4 py-2 text-left">Plan</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sites.map(site => (
              <motion.tr
                key={site.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-[#232347] hover:bg-neon-blue/10 hover:shadow-neon cursor-pointer transition"
                onClick={() => window.location.href = `/hosting/${site.id}`}
                whileHover={{ scale: 1.01, boxShadow: "0 0 8px #a259ff, 0 0 16px #00fff7" }}
              >
                <td className="px-4 py-2 font-semibold">{site.domain}</td>
                <td className="px-4 py-2">{site.plan}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${site.status === "creating" ? "bg-yellow-500 text-black" : site.status === "active" ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>{site.status}</span>
                </td>
                <td className="px-4 py-2">{new Date(site.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); window.location.href = `/hosting/${site.id}`; }}>Details</Button>
                </td>
              </motion.tr>
            ))}
            {sites.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 py-8">No sites found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-4 text-[#a259ff] text-center">Loading...</div>}
      </Card>
      {showCreate && <CreateSiteModal onClose={() => setShowCreate(false)} onCreated={fetchSites} />}
    </div>
  );
}

function CreateSiteModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleCreate() {
    setLoading(true);
    await fetch("/hosting/api/sites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, plan }),
    });
    setLoading(false);
    onCreated();
    onClose();
  }
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <Card className="p-6 w-full max-w-md bg-[#18192a] border border-[#232347]">
        <h2 className="text-xl font-bold text-[#a259ff] mb-4">Create Hosting Site</h2>
        <input
          className="w-full mb-3 px-3 py-2 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
          placeholder="Domain"
          value={domain}
          onChange={e => setDomain(e.target.value)}
        />
        <input
          className="w-full mb-3 px-3 py-2 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
          placeholder="Plan"
          value={plan}
          onChange={e => setPlan(e.target.value)}
        />
        <div className="flex gap-2 mt-4">
          <Button className="bg-[#a259ff] text-white flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button className="bg-[#00fff7] text-[#18192a] flex-1" onClick={handleCreate} disabled={loading || !domain || !plan}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
