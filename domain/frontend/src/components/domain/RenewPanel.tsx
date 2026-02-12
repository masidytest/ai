"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RenewPanelProps {
  expiresAt: string;
  onRenew?: () => Promise<void>;
}

export const RenewPanel: React.FC<RenewPanelProps> = ({ expiresAt, onRenew }) => {
  const [status, setStatus] = useState<"idle" | "renewing" | "success" | "error">("idle");

  const handleRenew = async () => {
    setStatus("renewing");
    try {
      if (onRenew) {
        await onRenew();
      } else {
        // Mock delay
        await new Promise((res) => setTimeout(res, 1200));
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col items-center">
      <div className="font-semibold text-[#a259ff] mb-2">Renew Domain</div>
      <div className="mb-4 text-[#00fff7]">Current Expiration: {expiresAt}</div>
      <Button
        className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
        disabled={status === "renewing" || status === "success"}
        onClick={handleRenew}
      >
        {status === "renewing"
          ? "Renewing..."
          : status === "success"
          ? "Renewed!"
          : "Renew for 1 year ($12)"}
      </Button>
      {status === "success" && <div className="mt-2 text-green-400">Domain renewed successfully!</div>}
      {status === "error" && <div className="mt-2 text-red-400">Renewal failed. Try again.</div>}
    </Card>
  );
};
