"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SslPanelProps {
  siteId: string;
}

export const SslPanel: React.FC<SslPanelProps> = ({ siteId }) => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState<null | { issuedTo: string; issuedBy: string; validFrom: string; validTo: string }>(null);

  useEffect(() => {
    fetch(`/hosting/api/sites/${siteId}`)
      .then(res => res.json())
      .then(site => {
        setEnabled(!!site.sslEnabled);
        if (site.sslEnabled) {
          setCert({
            issuedTo: site.domain,
            issuedBy: "Let's Encrypt",
            validFrom: "2026-02-11",
            validTo: "2027-02-11",
          });
        } else {
          setCert(null);
        }
      });
  }, [siteId]);

  async function handleEnable() {
    setLoading(true);
    await fetch(`/hosting/api/sites/${siteId}/ssl/enable`, { method: "POST" });
    setEnabled(true);
    setCert({
      issuedTo: "example.com",
      issuedBy: "Let's Encrypt",
      validFrom: "2026-02-11",
      validTo: "2027-02-11",
    });
    setLoading(false);
  }
  async function handleDisable() {
    setLoading(true);
    await fetch(`/hosting/api/sites/${siteId}/ssl/disable`, { method: "POST" });
    setEnabled(false);
    setCert(null);
    setLoading(false);
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col items-center">
      <div className="font-semibold text-[#a259ff] mb-2">SSL</div>
      <div className="mb-4 text-[#00fff7]">SSL Enabled: {enabled === null ? "..." : enabled ? "Yes" : "No"}</div>
      <div className="flex gap-2 mb-4">
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          disabled={loading || enabled === true}
          onClick={handleEnable}
        >
          Enable SSL
        </Button>
        <Button
          className="bg-red-500 text-white hover:bg-red-700"
          disabled={loading || enabled === false}
          onClick={handleDisable}
        >
          Disable SSL
        </Button>
      </div>
      {cert && (
        <div className="w-full text-left text-xs text-[#00fff7] bg-[#232347] rounded p-2">
          <div>Issued To: <span className="font-mono">{cert.issuedTo}</span></div>
          <div>Issued By: <span className="font-mono">{cert.issuedBy}</span></div>
          <div>Valid From: <span className="font-mono">{cert.validFrom}</span></div>
          <div>Valid To: <span className="font-mono">{cert.validTo}</span></div>
        </div>
      )}
    </Card>
  );
};
