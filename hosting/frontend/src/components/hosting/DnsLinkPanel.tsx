"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

interface DnsLinkPanelProps {
  siteId: string;
  domain: string;
}

export const DnsLinkPanel: React.FC<DnsLinkPanelProps> = ({ siteId, domain }) => {
  const [status, setStatus] = useState<null | boolean>(null);
  const [records, setRecords] = useState<DnsRecord[]>([]);
  const [verifying, setVerifying] = useState(false);
  const [propagated, setPropagated] = useState<null | boolean>(null);

  useEffect(() => {
    fetch(`/hosting/api/sites/${siteId}/dns/check`, { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setStatus(data.linked);
        setRecords(data.records);
      });
  }, [siteId]);

  async function handleVerify() {
    setVerifying(true);
    const res = await fetch(`/hosting/api/sites/${siteId}/dns/verify`, { method: "POST" });
    const data = await res.json();
    setPropagated(data.propagated);
    setVerifying(false);
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4">
      <div className="font-semibold text-[#a259ff] mb-2">DNS Linking</div>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-[#00fff7]">Status:</span>
        {status === null ? (
          <span className="text-gray-400">Checking...</span>
        ) : status ? (
          <span className="bg-green-500 text-black px-2 py-1 rounded text-xs font-bold">Linked</span>
        ) : (
          <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">Not Linked</span>
        )}
      </div>
      <div className="mb-4">
        <div className="text-[#a259ff] font-semibold mb-1">Suggested DNS Records</div>
        <table className="w-full text-sm mb-2">
          <thead>
            <tr className="text-[#00fff7]">
              <th className="text-left">Type</th>
              <th className="text-left">Name</th>
              <th className="text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec, i) => (
              <tr key={i} className="border-b border-[#232347]">
                <td>{rec.type}</td>
                <td>{rec.name}</td>
                <td>{rec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={handleVerify} disabled={verifying}>
        {verifying ? "Verifying..." : "Verify Propagation"}
      </Button>
      {propagated !== null && (
        <div className={`mt-3 text-sm font-bold ${propagated ? "text-green-400" : "text-red-400"}`}>
          {propagated ? "DNS propagation verified!" : "Propagation not complete yet."}
        </div>
      )}
    </Card>
  );
};
