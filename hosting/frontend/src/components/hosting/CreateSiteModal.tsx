"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const PLANS = [
  { value: "basic", label: "Basic" },
  { value: "pro", label: "Pro" },
  { value: "business", label: "Business" },
];

interface CreateSiteModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ onClose, onCreated }) => {
  const [domain, setDomain] = useState("");
  const [plan, setPlan] = useState(PLANS[0].value);
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
        <Select value={plan} onValueChange={setPlan}>
          <SelectTrigger className="w-full mb-3 bg-[#232347] text-[#a259ff] border-[#232347]">
            <SelectValue placeholder="Select plan" />
          </SelectTrigger>
          <SelectContent className="bg-[#232347] text-[#a259ff]">
            {PLANS.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 mt-4">
          <Button className="bg-[#a259ff] text-white flex-1" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button className="bg-[#00fff7] text-[#18192a] flex-1 flex items-center justify-center" onClick={handleCreate} disabled={loading || !domain || !plan}>
            {loading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
};
