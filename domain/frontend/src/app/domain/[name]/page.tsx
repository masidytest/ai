"use client";
import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Types
interface DnsRecord {
  id: string;
  type: string;
  name: string;
  value: string;
  ttl: number;
}
interface WhoisData {
  registrar: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  registrant: string;
  email: string;
}
interface DomainDetailData {
  name: string;
  available: boolean;
  expiresAt: string;
  dns: DnsRecord[];
  whois: WhoisData;
  nameservers: string[];
}

// Mock fetch (replace with real API calls)
async function fetchDomainDetail(domain: string): Promise<DomainDetailData> {
  const res = await fetch(`/domain/api/domains/${domain}`);
  if (!res.ok) throw new Error("Failed to fetch domain detail");
  return await res.json();
}

export default function DomainDetailPage({ params }: { params: { name: string } }) {
  const [data, setData] = useState<DomainDetailData | null>(null);
  const [dns, setDns] = useState<DnsRecord[]>([]);
  const [editingDns, setEditingDns] = useState<DnsRecord | null>(null);
  const [nameservers, setNameservers] = useState<string[]>([]);
  const [newNs, setNewNs] = useState("");
  const [renewing, setRenewing] = useState(false);
  const [renewed, setRenewed] = useState(false);

  useEffect(() => {
    fetchDomainDetail(params.name).then((d) => {
      setData(d);
      setDns(d.dns);
      setNameservers(d.nameservers);
    });
  }, [params.name]);

  // DNS CRUD handlers (mock)
  const addDns = (rec: DnsRecord) => setDns((prev) => [...prev, { ...rec, id: Date.now().toString() }]);
  const updateDns = (rec: DnsRecord) => setDns((prev) => prev.map((r) => (r.id === rec.id ? rec : r)));
  const deleteDns = (id: string) => setDns((prev) => prev.filter((r) => r.id !== id));

  // Nameserver handlers
  const addNameserver = () => {
    if (newNs.trim()) setNameservers((prev) => [...prev, newNs.trim()]);
    setNewNs("");
  };
  const removeNameserver = (i: number) => setNameservers((prev) => prev.filter((_, idx) => idx !== i));

  // Renew handler (mock)
  const handleRenew = async () => {
    setRenewing(true);
    setTimeout(() => {
      setRenewed(true);
      setRenewing(false);
    }, 1200);
  };

  if (!data) return <div className="text-center text-[#a259ff] mt-10">Loading domain details...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-[#a259ff]">{data.name}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${data.available ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>
            {data.available ? "Available" : "Registered"}
          </span>
          <span className="ml-auto text-[#00fff7] font-mono">Expires: {data.expiresAt}</span>
        </div>
      </motion.div>
      <Tabs defaultValue="dns" className="w-full">
        <TabsList className="bg-[#232347] border border-[#232347] mb-4">
          <TabsTrigger value="dns">DNS Records</TabsTrigger>
          <TabsTrigger value="whois">WHOIS</TabsTrigger>
          <TabsTrigger value="renew">Renew</TabsTrigger>
          <TabsTrigger value="nameservers">Nameservers</TabsTrigger>
        </TabsList>
        {/* DNS Manager */}
        <TabsContent value="dns">
          <Card className="bg-[#18192a] border border-[#232347] p-4">
            <div className="font-semibold text-[#a259ff] mb-2">DNS Records</div>
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="text-[#00fff7]">
                  <th className="text-left">Type</th>
                  <th className="text-left">Name</th>
                  <th className="text-left">Value</th>
                  <th className="text-left">TTL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dns.map((rec) => (
                  <tr key={rec.id} className="border-b border-[#232347]">
                    <td>{rec.type}</td>
                    <td>{rec.name}</td>
                    <td>{rec.value}</td>
                    <td>{rec.ttl}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={() => setEditingDns(rec)}>Edit</Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteDns(rec.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Add/Edit DNS */}
            <DnsEditor
              record={editingDns}
              onSave={(rec) => {
                if (rec.id) updateDns(rec);
                else addDns(rec);
                setEditingDns(null);
              }}
              onCancel={() => setEditingDns(null)}
            />
            <Button className="mt-2 bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => setEditingDns({ id: "", type: "A", name: "", value: "", ttl: 3600 })}>
              Add Record
            </Button>
          </Card>
        </TabsContent>
        {/* WHOIS Viewer */}
        <TabsContent value="whois">
          <Card className="bg-[#18192a] border border-[#232347] p-4">
            <div className="font-semibold text-[#a259ff] mb-2">WHOIS Information</div>
            <div className="grid grid-cols-2 gap-4">
              <div><span className="text-[#00fff7]">Registrar:</span> {data.whois.registrar}</div>
              <div><span className="text-[#00fff7]">Registrant:</span> {data.whois.registrant}</div>
              <div><span className="text-[#00fff7]">Created:</span> {data.whois.createdAt}</div>
              <div><span className="text-[#00fff7]">Updated:</span> {data.whois.updatedAt}</div>
              <div><span className="text-[#00fff7]">Expires:</span> {data.whois.expiresAt}</div>
              <div><span className="text-[#00fff7]">Email:</span> {data.whois.email}</div>
            </div>
          </Card>
        </TabsContent>
        {/* Renew Panel */}
        <TabsContent value="renew">
          <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col items-center">
            <div className="font-semibold text-[#a259ff] mb-2">Renew Domain</div>
            <div className="mb-4 text-[#00fff7]">Current Expiration: {data.expiresAt}</div>
            <Button
              className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
              disabled={renewing || renewed}
              onClick={handleRenew}
            >
              {renewing ? "Renewing..." : renewed ? "Renewed!" : "Renew for 1 year ($12)"}
            </Button>
            {renewed && <div className="mt-2 text-green-400">Domain renewed successfully!</div>}
          </Card>
        </TabsContent>
        {/* Nameserver Editor */}
        <TabsContent value="nameservers">
          <Card className="bg-[#18192a] border border-[#232347] p-4">
            <div className="font-semibold text-[#a259ff] mb-2">Nameservers</div>
            <div className="flex flex-wrap gap-2 mb-4">
              {nameservers.map((ns, i) => (
                <div key={i} className="flex items-center bg-[#232347] rounded px-3 py-1">
                  <span className="font-mono text-[#00fff7]">{ns}</span>
                  <Button size="sm" variant="ghost" onClick={() => removeNameserver(i)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                className="bg-[#232347] text-[#a259ff] border-[#232347]"
                placeholder="Add nameserver"
                value={newNs}
                onChange={(e) => setNewNs(e.target.value)}
              />
              <Button className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={addNameserver}>
                Add
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// DNS Editor subcomponent
function DnsEditor({ record, onSave, onCancel }: { record: DnsRecord | null; onSave: (rec: DnsRecord) => void; onCancel: () => void }) {
  const [form, setForm] = useState<DnsRecord>(record || { id: "", type: "A", name: "", value: "", ttl: 3600 });
  useEffect(() => {
    setForm(record || { id: "", type: "A", name: "", value: "", ttl: 3600 });
  }, [record]);
  if (!record) return null;
  return (
    <div className="flex gap-2 mb-2 items-end">
      <select
        className="bg-[#232347] text-[#a259ff] border-[#232347] rounded px-2 py-1"
        value={form.type}
        onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
      >
        <option value="A">A</option>
        <option value="AAAA">AAAA</option>
        <option value="CNAME">CNAME</option>
        <option value="TXT">TXT</option>
        <option value="MX">MX</option>
        <option value="NS">NS</option>
      </select>
      <Input
        className="bg-[#232347] text-[#a259ff] border-[#232347]"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
      />
      <Input
        className="bg-[#232347] text-[#a259ff] border-[#232347]"
        placeholder="Value"
        value={form.value}
        onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
      />
      <Input
        className="bg-[#232347] text-[#a259ff] border-[#232347] w-20"
        placeholder="TTL"
        type="number"
        value={form.ttl}
        onChange={(e) => setForm((f) => ({ ...f, ttl: Number(e.target.value) }))}
      />
      <Button size="sm" className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => onSave(form)}>
        Save
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
