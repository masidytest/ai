"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DatabaseInstance {
  id: string;
  name: string;
  provider: string;
  region: string;
  status: string;
  connectionUrl: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<string, string> = {
  provisioning: "bg-yellow-500 text-black",
  available: "bg-green-500 text-black",
  error: "bg-red-500 text-white",
  deleted: "bg-gray-500 text-white",
};

export default function DatabaseDashboard() {
  const [databases, setDatabases] = useState<DatabaseInstance[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDatabases = async () => {
    setLoading(true);
    const res = await fetch("/api/databases");
    const data = await res.json();
    setDatabases(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDatabases();
    const interval = setInterval(fetchDatabases, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0020] text-white p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
          Databases
        </h1>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500">
          + Create Database
        </Button>
      </div>
      <Card className="w-full bg-[#18102b] border border-[#2d1a5a] shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#2d1a5a]">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-purple-300 animate-pulse">
                    Loading...
                  </td>
                </tr>
              ) : databases.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-purple-300">
                    No databases found.
                  </td>
                </tr>
              ) : (
                databases.map((db) => (
                  <tr key={db.id} className="hover:bg-[#22134a] transition">
                    <td className="px-4 py-3 font-medium text-purple-200">{db.name}</td>
                    <td className="px-4 py-3">{db.provider}</td>
                    <td className="px-4 py-3">{db.region}</td>
                    <td className="px-4 py-3">
                      <Badge className={cn("rounded px-3 py-1 font-semibold", statusColors[db.status] || "bg-gray-700")}>{db.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(db.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
