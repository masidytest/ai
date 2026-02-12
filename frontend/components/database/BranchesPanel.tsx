"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitBranchPlus, GitMerge } from "lucide-react";

interface Branch {
  name: string;
  createdAt: string;
  merged: boolean;
}

export function BranchesPanel({ databaseId }: { databaseId: string }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [merging, setMerging] = useState<string | null>(null);
  const [newBranch, setNewBranch] = useState("");

  const fetchBranches = async () => {
    setLoading(true);
    const res = await fetch(`/api/databases/${databaseId}/branches`);
    const data = await res.json();
    setBranches(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
    // Optionally, poll for updates
    // const interval = setInterval(fetchBranches, 10000);
    // return () => clearInterval(interval);
  }, [databaseId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch) return;
    setCreating(true);
    await fetch(`/api/databases/${databaseId}/branches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBranch }),
    });
    setCreating(false);
    setNewBranch("");
    fetchBranches();
  };

  const handleMerge = async (branchName: string) => {
    setMerging(branchName);
    await fetch(`/api/databases/${databaseId}/branches/${branchName}/merge`, { method: "POST" });
    setMerging(null);
    fetchBranches();
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-purple-300">Branches</h2>
        <form onSubmit={handleCreate} className="flex gap-2 items-center">
          <input
            type="text"
            value={newBranch}
            onChange={e => setNewBranch(e.target.value)}
            placeholder="Branch name"
            className="bg-[#22134a] border border-[#2d1a5a] text-white rounded px-2 py-1 text-sm focus:ring-purple-500"
            disabled={creating}
            required
          />
          <Button
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500 flex items-center gap-2"
            type="submit"
            disabled={creating}
          >
            <GitBranchPlus size={16} /> {creating ? "Creating..." : "Create"}
          </Button>
        </form>
      </div>
      {loading ? (
        <div className="text-purple-200 animate-pulse">Loading branches...</div>
      ) : branches.length === 0 ? (
        <div className="text-purple-200">No branches found.</div>
      ) : (
        <ul className="space-y-2">
          {branches.map((b) => (
            <li key={b.name} className="flex items-center justify-between bg-[#22134a] rounded px-3 py-2">
              <div>
                <div className="font-mono text-purple-100 text-xs">{b.name}</div>
                <div className="text-xs text-gray-400">{new Date(b.createdAt).toLocaleString()}</div>
                <div className="text-xs text-blue-300">{b.merged ? "Merged" : "Active"}</div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1 hover:bg-purple-800"
                onClick={() => handleMerge(b.name)}
                disabled={merging === b.name || b.merged}
                title={b.merged ? "Already merged" : "Merge branch"}
              >
                <GitMerge size={16} /> {merging === b.name ? "Merging..." : "Merge"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
