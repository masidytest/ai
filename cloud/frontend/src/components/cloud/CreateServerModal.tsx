"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { motion } from "framer-motion";

interface Region { id: string; name: string; }
interface Plan { id: string; name: string; cpu: number; ram: number; disk: number; price: number; }

interface CreateServerModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const CreateServerModal: React.FC<CreateServerModalProps> = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [plan, setPlan] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetch("/api/cloud/regions").then(r => r.json()).then(setRegions);
      fetch("/api/cloud/plans").then(r => r.json()).then(setPlans);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/cloud/servers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, region, plan })
    });
    setSubmitting(false);
    setName("");
    setRegion("");
    setPlan("");
    if (onCreated) onCreated();
    onClose();
  }

  if (!open) return null;

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Card className="w-full max-w-md p-6 bg-[#18192a] border border-[#232347] relative">
        <h2 className="text-xl font-bold text-[#a259ff] mb-4">Create Server</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required className="bg-[#232347] border-[#a259ff] text-white" />
          </div>
          <div>
            <label className="block mb-1 text-sm">Region</label>
            <Select value={region} onValueChange={setRegion} required>
              <option value="" disabled>Select region</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Plan</label>
            <Select value={plan} onValueChange={setPlan} required>
              <option value="" disabled>Select plan</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.name} ({p.cpu} CPU, {p.ram}GB RAM, {p.disk}GB SSD, ${p.price}/mo)</option>)}
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#a259ff] text-[#a259ff]">Cancel</Button>
            <Button type="submit" disabled={submitting} className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">
              {submitting ? <span className="animate-spin mr-2">⏳</span> : null}Create
            </Button>
          </div>
        </form>
        <button onClick={onClose} className="absolute top-2 right-2 text-[#a259ff] text-xl">×</button>
      </Card>
    </motion.div>
  );
};
