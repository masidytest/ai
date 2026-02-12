"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder imports for panels/components
// Replace with actual implementations as you build them
const SchemaExplorer = ({ databaseId }: { databaseId: string }) => (
  <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">Schema Explorer (TODO)</Card>
);
const QueryEditor = ({ databaseId, onResult }: { databaseId: string; onResult: (result: any) => void }) => (
  <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">Query Editor (TODO)</Card>
);
const QueryResultsTable = ({ result }: { result: any }) => (
  <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">Query Results Table (TODO)</Card>
);
const BackupsPanel = ({ databaseId }: { databaseId: string }) => (
  <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">Backups Panel (TODO)</Card>
);
const BranchesPanel = ({ databaseId }: { databaseId: string }) => (
  <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">Branches Panel (TODO)</Card>
);

const statusColors: Record<string, string> = {
  provisioning: "bg-yellow-500 text-black",
  available: "bg-green-500 text-black",
  error: "bg-red-500 text-white",
  deleted: "bg-gray-500 text-white",
};

export default function DatabaseDetailPage() {
  const params = useParams();
  const databaseId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [queryResult, setQueryResult] = useState<any>(null);

  useEffect(() => {
    if (!databaseId) return;
    setLoading(true);
    fetch(`/api/databases/${databaseId}`)
      .then(res => res.json())
      .then(setDb)
      .finally(() => setLoading(false));
  }, [databaseId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0036] to-[#0f0020] text-white">
        <div className="text-purple-300 animate-pulse text-xl">Loading database...</div>
      </div>
    );
  }
  if (!db) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0036] to-[#0f0020] text-white">
        <div className="text-red-400 text-xl">Database not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0036] to-[#0f0020] text-white p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
            {db.name}
          </h1>
          <div className="flex gap-4 mt-2 text-sm">
            <span className="text-purple-200">Provider: <span className="font-semibold">{db.provider}</span></span>
            <span className="text-purple-200">Region: <span className="font-semibold">{db.region}</span></span>
            <Badge className={cn("rounded px-3 py-1 font-semibold", statusColors[db.status] || "bg-gray-700")}>{db.status}</Badge>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500">
          Manage
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SchemaExplorer databaseId={databaseId} />
          <QueryEditor databaseId={databaseId} onResult={setQueryResult} />
          <QueryResultsTable result={queryResult} />
        </div>
        <div>
          <BackupsPanel databaseId={databaseId} />
          <BranchesPanel databaseId={databaseId} />
        </div>
      </div>
    </div>
  );
}
