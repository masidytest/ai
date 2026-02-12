"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── types ─── */
interface Server {
  id: string;
  name: string;
  status: "running" | "stopped" | "provisioning" | "error";
  region: string;
  plan: string;
  ip: string;
  cpu: number;
  ram: number;
  storage: number;
  cpuUsage: number;
  ramUsage: number;
  storageUsed: number;
  uptime: string;
  os: string;
  monthly: number;
}

/* ─── data ─── */
const regions = ["All Regions", "US East", "US West", "EU West", "EU Central", "Asia Pacific"];
const plans = ["Starter", "Standard", "Performance", "Enterprise"];

const initialServers: Server[] = [
  { id: "srv-001", name: "prod-api-01", status: "running", region: "US East", plan: "Performance", ip: "203.0.113.42", cpu: 8, ram: 16, storage: 320, cpuUsage: 42, ramUsage: 68, storageUsed: 187, uptime: "34d 12h", os: "Ubuntu 24.04", monthly: 96 },
  { id: "srv-002", name: "prod-web-01", status: "running", region: "US East", plan: "Standard", ip: "203.0.113.43", cpu: 4, ram: 8, storage: 160, cpuUsage: 28, ramUsage: 55, storageUsed: 92, uptime: "34d 12h", os: "Ubuntu 24.04", monthly: 48 },
  { id: "srv-003", name: "staging-api", status: "running", region: "EU West", plan: "Starter", ip: "198.51.100.10", cpu: 2, ram: 4, storage: 80, cpuUsage: 12, ramUsage: 31, storageUsed: 24, uptime: "12d 8h", os: "Debian 12", monthly: 24 },
  { id: "srv-004", name: "ml-worker-01", status: "stopped", region: "US West", plan: "Enterprise", ip: "198.51.100.22", cpu: 16, ram: 64, storage: 500, cpuUsage: 0, ramUsage: 0, storageUsed: 312, uptime: "--", os: "Ubuntu 22.04", monthly: 240 },
  { id: "srv-005", name: "db-replica", status: "running", region: "EU Central", plan: "Standard", ip: "203.0.113.55", cpu: 4, ram: 8, storage: 500, cpuUsage: 35, ramUsage: 72, storageUsed: 389, uptime: "20d 5h", os: "Ubuntu 24.04", monthly: 56 },
  { id: "srv-006", name: "edge-cdn-apac", status: "provisioning", region: "Asia Pacific", plan: "Starter", ip: "pending", cpu: 2, ram: 4, storage: 80, cpuUsage: 0, ramUsage: 0, storageUsed: 0, uptime: "--", os: "Alpine 3.19", monthly: 24 },
];

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  running: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Running" },
  stopped: { color: "text-gray-400", bg: "bg-gray-500/10", label: "Stopped" },
  provisioning: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Provisioning" },
  error: { color: "text-red-400", bg: "bg-red-500/10", label: "Error" },
};

let nextId = 7;

export function CloudPage() {
  const [servers, setServers] = useState<Server[]>(initialServers);
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRegion, setNewRegion] = useState("US East");
  const [newPlan, setNewPlan] = useState("Starter");
  const [newOs, setNewOs] = useState("Ubuntu 24.04");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");

  /* Live CPU simulation for running servers */
  useEffect(() => {
    const interval = setInterval(() => {
      setServers((prev) => prev.map((s) => s.status === "running" ? { ...s, cpuUsage: Math.max(5, Math.min(95, s.cpuUsage + (Math.random() - 0.5) * 8)), ramUsage: Math.max(10, Math.min(95, s.ramUsage + (Math.random() - 0.5) * 4)) } : s));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setServers((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "running" ? "stopped" : "running", cpuUsage: s.status === "running" ? 0 : 15, ramUsage: s.status === "running" ? 0 : 20, uptime: s.status === "running" ? "--" : "0d 0h" } : s));
  }, []);

  const deleteServer = useCallback((id: string) => {
    setServers((prev) => prev.filter((s) => s.id !== id));
    if (selected === id) setSelected(null);
    setConfirmDelete(null);
  }, [selected]);

  const createServer = useCallback(() => {
    if (!newName.trim()) return;
    const planSpecs: Record<string, { cpu: number; ram: number; storage: number; monthly: number }> = {
      Starter: { cpu: 2, ram: 4, storage: 80, monthly: 24 },
      Standard: { cpu: 4, ram: 8, storage: 160, monthly: 48 },
      Performance: { cpu: 8, ram: 16, storage: 320, monthly: 96 },
      Enterprise: { cpu: 16, ram: 64, storage: 500, monthly: 240 },
    };
    const specs = planSpecs[newPlan];
    const srv: Server = { id: `srv-${String(nextId++).padStart(3, "0")}`, name: newName.trim(), status: "provisioning", region: newRegion, plan: newPlan, ip: "pending", ...specs, cpuUsage: 0, ramUsage: 0, storageUsed: 0, uptime: "--", os: newOs, monthly: specs.monthly };
    setServers((prev) => [srv, ...prev]);
    setShowCreate(false);
    setNewName("");
    setTimeout(() => {
      setServers((prev) => prev.map((s) => s.id === srv.id ? { ...s, status: "running", ip: `203.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`, cpuUsage: 8, ramUsage: 15, uptime: "0d 0h" } : s));
    }, 4000);
  }, [newName, newRegion, newPlan, newOs]);

  const toggleStatusFilter = (s: string) => setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);

  const filtered = servers.filter((s) => {
    if (regionFilter !== "All Regions" && s.region !== regionFilter) return false;
    if (statusFilter.length > 0 && !statusFilter.includes(s.status)) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.ip.includes(search)) return false;
    return true;
  });

  const selectedServer = servers.find((s) => s.id === selected);
  const totalMonthly = servers.reduce((a, s) => a + (s.status !== "stopped" ? s.monthly : 0), 0);
  const runningCount = servers.filter((s) => s.status === "running").length;

  function UsageBar({ value, max, color }: { value: number; max: number; color: string }) {
    const pct = Math.round((value / max) * 100);
    return (
      <div className="w-full">
        <div className="flex justify-between text-[10px] text-app-text-muted mb-0.5"><span>{value}{typeof max === "number" && max > 100 ? " GB" : "%"}</span><span>{max}{typeof max === "number" && max > 100 ? " GB" : "%"}</span></div>
        <div className="h-1.5 rounded-full bg-app-border overflow-hidden"><motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} /></div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Cloud Infrastructure</h1>
          <p className="text-sm text-app-text-muted mt-1">{servers.length} servers &middot; {runningCount} running &middot; ${totalMonthly}/mo</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreate(!showCreate)} className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors flex items-center gap-2 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Create Server
        </motion.button>
      </div>

      {/* Create Panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
            <div className="bg-app-card border border-app-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-app-text mb-4">Provision New Server</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-xs text-app-text-muted mb-1.5">Server Name</label>
                  <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="my-server" className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" />
                </div>
                <div>
                  <label className="block text-xs text-app-text-muted mb-1.5">Region</label>
                  <select value={newRegion} onChange={(e) => setNewRegion(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-app-accent/50">{regions.slice(1).map((r) => <option key={r}>{r}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-app-text-muted mb-1.5">Plan</label>
                  <select value={newPlan} onChange={(e) => setNewPlan(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-app-accent/50">{plans.map((p) => <option key={p}>{p}</option>)}</select>
                </div>
                <div>
                  <label className="block text-xs text-app-text-muted mb-1.5">OS</label>
                  <select value={newOs} onChange={(e) => setNewOs(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-app-accent/50">
                    <option>Ubuntu 24.04</option><option>Ubuntu 22.04</option><option>Debian 12</option><option>Alpine 3.19</option><option>CentOS 9</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <button onClick={createServer} disabled={!newName.trim()} className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium text-sm hover:bg-emerald-500/20 transition-colors disabled:opacity-40">Create</button>
                  <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-muted text-sm hover:text-app-text">Cancel</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Servers", value: servers.length, icon: "M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7", accent: "var(--app-accent)" },
          { label: "Running", value: runningCount, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent: "#10b981" },
          { label: "Avg CPU", value: `${Math.round(servers.filter((s) => s.status === "running").reduce((a, s) => a + s.cpuUsage, 0) / (runningCount || 1))}%`, icon: "M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z", accent: "#3b82f6" },
          { label: "Monthly Cost", value: `$${totalMonthly}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1", accent: "#a855f7" },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="bg-app-card border border-app-border rounded-xl p-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stat.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon} /></svg>
              </div>
              <span className="text-xs text-app-text-muted">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold text-app-text">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {regions.map((r) => (
            <button key={r} onClick={() => setRegionFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${regionFilter === r ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30" : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text"}`}>{r}</button>
          ))}
        </div>
        <div className="flex gap-2 ml-auto">
          {(["running", "stopped", "provisioning", "error"] as const).map((s) => (
            <button key={s} onClick={() => toggleStatusFilter(s)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter.includes(s) ? `${statusConfig[s].bg} ${statusConfig[s].color}` : "bg-app-card border border-app-border text-app-text-muted"}`}>{s}</button>
          ))}
        </div>
      </div>
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or IP..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-app-card border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" />
        </div>
        <div className="flex bg-app-card border border-app-border rounded-lg overflow-hidden">
          <button onClick={() => setView("grid")} className={`px-3 py-2 ${view === "grid" ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
          </button>
          <button onClick={() => setView("list")} className={`px-3 py-2 ${view === "list" ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted"}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          {view === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((s, i) => {
                const sc = statusConfig[s.status];
                return (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(s.id)} className={`bg-app-card border rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg ${selected === s.id ? "border-app-accent/40 ring-1 ring-app-accent/20" : "border-app-border hover:border-app-accent/20"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.status === "running" ? "bg-emerald-500 animate-pulse" : s.status === "provisioning" ? "bg-amber-500 animate-pulse" : "bg-gray-500"}`} />
                        <span className="text-sm font-semibold text-app-text">{s.name}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-app-text-muted">
                      <div><span className="text-app-text-muted/50">IP:</span> <span className="text-app-text-secondary font-mono">{s.ip}</span></div>
                      <div><span className="text-app-text-muted/50">Region:</span> <span className="text-app-text-secondary">{s.region}</span></div>
                      <div><span className="text-app-text-muted/50">Plan:</span> <span className="text-app-text-secondary">{s.plan}</span></div>
                      <div><span className="text-app-text-muted/50">Uptime:</span> <span className="text-app-text-secondary">{s.uptime}</span></div>
                    </div>
                    {s.status === "running" && (
                      <div className="space-y-2">
                        <UsageBar value={Math.round(s.cpuUsage)} max={100} color={s.cpuUsage > 80 ? "bg-red-500" : s.cpuUsage > 60 ? "bg-amber-500" : "bg-emerald-500"} />
                        <UsageBar value={Math.round(s.ramUsage)} max={100} color={s.ramUsage > 80 ? "bg-red-500" : s.ramUsage > 60 ? "bg-amber-500" : "bg-blue-500"} />
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(s.id); }} className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${s.status === "running" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"}`}>
                        {s.status === "running" ? "Stop" : "Start"}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s.id); }} className="text-xs py-1.5 px-3 rounded-lg bg-app-bg border border-app-border text-app-text-muted hover:text-red-400 hover:border-red-400/30 transition-colors">Delete</button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-app-border text-xs text-app-text-muted uppercase tracking-wider">
                    <th className="px-4 py-3">Name</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">IP</th><th className="px-4 py-3">Region</th><th className="px-4 py-3">CPU</th><th className="px-4 py-3">RAM</th><th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, i) => {
                    const sc = statusConfig[s.status];
                    return (
                      <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} onClick={() => setSelected(s.id)} className={`border-b border-app-border/50 cursor-pointer transition-colors ${selected === s.id ? "bg-app-accent/5" : "hover:bg-app-accent/5"}`}>
                        <td className="px-4 py-3 font-medium text-app-text">{s.name}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.color}`}>{sc.label}</span></td>
                        <td className="px-4 py-3 font-mono text-app-text-secondary text-xs">{s.ip}</td>
                        <td className="px-4 py-3 text-app-text-secondary">{s.region}</td>
                        <td className="px-4 py-3 text-app-text-secondary">{Math.round(s.cpuUsage)}%</td>
                        <td className="px-4 py-3 text-app-text-secondary">{Math.round(s.ramUsage)}%</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); toggleStatus(s.id); }} className={`text-xs px-2 py-1 rounded ${s.status === "running" ? "text-red-400" : "text-emerald-500"}`}>{s.status === "running" ? "Stop" : "Start"}</button>
                            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s.id); }} className="text-xs px-2 py-1 rounded text-app-text-muted hover:text-red-400">Delete</button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedServer && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="shrink-0 overflow-hidden">
              <div className="bg-app-card border border-app-border rounded-xl p-5 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-app-text">{selectedServer.name}</h3>
                  <button onClick={() => setSelected(null)} className="text-app-text-muted hover:text-app-text">&times;</button>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${statusConfig[selectedServer.status].bg} ${statusConfig[selectedServer.status].color}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedServer.status === "running" ? "bg-emerald-500" : "bg-gray-500"}`} />
                  {statusConfig[selectedServer.status].label}
                </div>
                <div className="space-y-3 mb-5">
                  {[
                    { k: "IP Address", v: selectedServer.ip },
                    { k: "Region", v: selectedServer.region },
                    { k: "Plan", v: selectedServer.plan },
                    { k: "OS", v: selectedServer.os },
                    { k: "CPU", v: `${selectedServer.cpu} vCPU` },
                    { k: "RAM", v: `${selectedServer.ram} GB` },
                    { k: "Storage", v: `${selectedServer.storage} GB` },
                    { k: "Uptime", v: selectedServer.uptime },
                    { k: "Monthly", v: `$${selectedServer.monthly}` },
                  ].map(({ k, v }) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-app-text-muted">{k}</span>
                      <span className="text-app-text font-medium">{v}</span>
                    </div>
                  ))}
                </div>
                {selectedServer.status === "running" && (
                  <div className="space-y-3 mb-5 pt-4 border-t border-app-border">
                    <div className="text-xs text-app-text-muted font-medium mb-2">Resource Usage</div>
                    <div><span className="text-[10px] text-app-text-muted">CPU</span><UsageBar value={Math.round(selectedServer.cpuUsage)} max={100} color={selectedServer.cpuUsage > 80 ? "bg-red-500" : "bg-emerald-500"} /></div>
                    <div><span className="text-[10px] text-app-text-muted">RAM</span><UsageBar value={Math.round(selectedServer.ramUsage)} max={100} color={selectedServer.ramUsage > 80 ? "bg-red-500" : "bg-blue-500"} /></div>
                    <div><span className="text-[10px] text-app-text-muted">Storage</span><UsageBar value={selectedServer.storageUsed} max={selectedServer.storage} color="bg-purple-500" /></div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => toggleStatus(selectedServer.id)} className={`flex-1 text-xs py-2 rounded-lg font-medium transition-colors ${selectedServer.status === "running" ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"}`}>
                    {selectedServer.status === "running" ? "Stop Server" : "Start Server"}
                  </button>
                  <button onClick={() => setConfirmDelete(selectedServer.id)} className="text-xs py-2 px-3 rounded-lg border border-red-400/20 text-red-400 hover:bg-red-500/10 transition-colors">Delete</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-app-card border border-app-border rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-app-text mb-2">Delete Server</h3>
              <p className="text-sm text-app-text-muted mb-6">Are you sure you want to delete <span className="font-medium text-app-text">{servers.find((s) => s.id === confirmDelete)?.name}</span>? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-secondary text-sm hover:text-app-text transition-colors">Cancel</button>
                <button onClick={() => deleteServer(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
