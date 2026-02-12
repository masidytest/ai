"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const PROVIDERS = [
  { label: "PlanetScale", value: "planetscale" },
  { label: "Neon", value: "neon" },
  { label: "Supabase", value: "supabase" },
];

const REGIONS = [
  "us-east-1",
  "us-west-2",
  "eu-central-1",
  "ap-southeast-1",
];

interface CreateDatabaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

export function CreateDatabaseModal({ open, onOpenChange, onCreated }: CreateDatabaseModalProps) {
  const [name, setName] = useState("");
  const [provider, setProvider] = useState(PROVIDERS[0].value);
  const [region, setRegion] = useState(REGIONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/databases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, provider, region }),
      });
      if (!res.ok) throw new Error("Failed to create database");
      setName("");
      setProvider(PROVIDERS[0].value);
      setRegion(REGIONS[0]);
      onOpenChange(false);
      if (onCreated) onCreated();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#18102b] border border-[#2d1a5a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Create Database
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm text-purple-200">Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="bg-[#22134a] border-[#2d1a5a] text-white focus:ring-purple-500"
              placeholder="mydb"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 text-sm text-purple-200">Provider</label>
            <Select value={provider} onValueChange={setProvider} disabled={loading}>
              <SelectTrigger className="bg-[#22134a] border-[#2d1a5a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#22134a] border-[#2d1a5a] text-white">
                {PROVIDERS.map(p => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm text-purple-200">Region</label>
            <Select value={region} onValueChange={setRegion} disabled={loading}>
              <SelectTrigger className="bg-[#22134a] border-[#2d1a5a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#22134a] border-[#2d1a5a] text-white">
                {REGIONS.map(r => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "+ Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
