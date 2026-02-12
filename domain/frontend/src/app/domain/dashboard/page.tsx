"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Domain {
  id: string;
  name: string;
  status: "available" | "registered" | "pending" | "expired";
  expiresAt?: string;
  nameservers?: string[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  available: "bg-green-500 text-black",
  registered: "bg-blue-500 text-white",
  pending: "bg-yellow-500 text-black",
  expired: "bg-red-500 text-white",
};

export default function DomainDashboard() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchDomains() {
    setLoading(true);
    try {
      const res = await fetch("/domain/api/domains");
      if (!res.ok) throw new Error("Failed to fetch domains");
      setDomains(await res.json());
    } catch (e) {
      setDomains([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDomains();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    // Could trigger search or filter here
  }

  return (
    <div className="min-h-screen bg-[#10111a] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#a259ff]">Domains</h1>
        <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">Register Domain</Button>
      </div>
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          className="flex-1 px-3 py-2 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
          placeholder="Search for a domain..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button type="submit" className="bg-[#a259ff] text-white">Search</Button>
      </form>
      <Card className="w-full overflow-x-auto bg-[#18192a] border border-[#232347]">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-[#232347]">
              <th className="px-4 py-2 text-left">Domain</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Expires</th>
              <th className="px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {domains.map(domain => (
              <motion.tr
                key={domain.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-[#232347] hover:bg-neon-blue/10 hover:shadow-neon cursor-pointer transition"
                onClick={() => window.location.href = `/domain/${domain.name}`}
                whileHover={{ scale: 1.01, boxShadow: "0 0 8px #a259ff, 0 0 16px #00fff7" }}
              >
                <td className="px-4 py-2 font-semibold">{domain.name}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${STATUS_COLORS[domain.status]}`}>{domain.status}</span>
                </td>
                <td className="px-4 py-2">{domain.expiresAt ? new Date(domain.expiresAt).toLocaleDateString() : <span className="text-gray-500">-</span>}</td>
                <td className="px-4 py-2">{new Date(domain.createdAt).toLocaleString()}</td>
              </motion.tr>
            ))}
            {domains.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="text-center text-gray-400 py-8">No domains found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {loading && <div className="p-4 text-[#a259ff] text-center">Loading...</div>}
      </Card>
    </div>
  );
}
