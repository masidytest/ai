"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, Plus } from "lucide-react";

interface Backup {
  id: string;
  createdAt: string;
  status: string;
}

export function BackupsPanel({ databaseId }: { databaseId: string }) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const fetchBackups = async () => {
    setLoading(true);
    const res = await fetch(`/api/databases/${databaseId}/backups`);
    const data = await res.json();
    setBackups(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBackups();
    // Optionally, poll for updates
    // const interval = setInterval(fetchBackups, 10000);
    // return () => clearInterval(interval);
  }, [databaseId]);

  const handleCreate = async () => {
    setCreating(true);
    await fetch(`/api/databases/${databaseId}/backups`, { method: "POST" });
    setCreating(false);
    fetchBackups();
  };

  const handleRestore = async (backupId: string) => {
    setRestoring(backupId);
    await fetch(`/api/databases/${databaseId}/backups/${backupId}/restore`, { method: "POST" });
    setRestoring(null);
    fetchBackups();
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-purple-300">Backups</h2>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500 flex items-center gap-2"
          onClick={handleCreate}
          disabled={creating}
        >
          <Plus size={16} /> {creating ? "Creating..." : "Create Backup"}
        </Button>
      </div>
      {loading ? (
        <div className="text-purple-200 animate-pulse">Loading backups...</div>
      ) : backups.length === 0 ? (
        <div className="text-purple-200">No backups found.</div>
      ) : (
        <ul className="space-y-2">
          {backups.map((b) => (
            <li key={b.id} className="flex items-center justify-between bg-[#22134a] rounded px-3 py-2">
              <div>
                <div className="font-mono text-purple-100 text-xs">{b.id}</div>
                <div className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</div>
                <div className="text-xs text-blue-300">{b.status}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1 hover:bg-purple-800"
                onClick={() => handleRestore(b.id)}
                disabled={restoring === b.id}
              >
                <RotateCcw size={16} /> {restoring === b.id ? "Restoring..." : "Restore"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
