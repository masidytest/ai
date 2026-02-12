"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── types ─── */
interface Domain {
  id: string;
  name: string;
  status: "active" | "pending" | "expired" | "transferring";
  registrar: string;
  expires: string;
  autoRenew: boolean;
  ssl: "valid" | "expiring" | "none";
  sslExpires?: string;
  dns: DnsRecord[];
  nameservers: string[];
  privacy: boolean;
  project?: string;
}

interface DnsRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS";
  name: string;
  value: string;
  ttl: number;
  priority?: number;
}

/* ─── data ─── */
const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Active" },
  pending: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Pending" },
  expired: { bg: "bg-red-500/10", text: "text-red-400", label: "Expired" },
  transferring: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Transferring" },
};

const sslConfig: Record<string, { bg: string; text: string; label: string }> = {
  valid: { bg: "bg-emerald-500/10", text: "text-emerald-500", label: "Valid" },
  expiring: { bg: "bg-amber-500/10", text: "text-amber-500", label: "Expiring Soon" },
  none: { bg: "bg-gray-500/10", text: "text-gray-400", label: "No SSL" },
};

const makeDns = (domain: string): DnsRecord[] => [
  { id: "r1", type: "A", name: "@", value: "203.0.113.42", ttl: 3600 },
  { id: "r2", type: "CNAME", name: "www", value: domain, ttl: 3600 },
  { id: "r3", type: "MX", name: "@", value: `mail.${domain}`, ttl: 3600, priority: 10 },
  { id: "r4", type: "TXT", name: "@", value: "v=spf1 include:_spf.masidy.cloud ~all", ttl: 3600 },
];

const initialDomains: Domain[] = [
  { id: "dom-001", name: "masidy.com", status: "active", registrar: "Masidy Domains", expires: "2026-08-15", autoRenew: true, ssl: "valid", sslExpires: "2025-12-20", dns: makeDns("masidy.com"), nameservers: ["ns1.masidy.cloud", "ns2.masidy.cloud"], privacy: true, project: "Main Website" },
  { id: "dom-002", name: "masidy.dev", status: "active", registrar: "Masidy Domains", expires: "2026-03-10", autoRenew: true, ssl: "valid", sslExpires: "2025-11-15", dns: makeDns("masidy.dev"), nameservers: ["ns1.masidy.cloud", "ns2.masidy.cloud"], privacy: true, project: "Developer Portal" },
  { id: "dom-003", name: "futurist.dev", status: "active", registrar: "Masidy Domains", expires: "2025-09-22", autoRenew: false, ssl: "expiring", sslExpires: "2025-02-01", dns: makeDns("futurist.dev"), nameservers: ["ns1.masidy.cloud", "ns2.masidy.cloud"], privacy: false },
  { id: "dom-004", name: "neonui.app", status: "expired", registrar: "External", expires: "2025-01-01", autoRenew: false, ssl: "none", dns: [], nameservers: ["ns1.example.com", "ns2.example.com"], privacy: false },
  { id: "dom-005", name: "myproject.io", status: "pending", registrar: "Masidy Domains", expires: "2027-01-20", autoRenew: true, ssl: "none", dns: [], nameservers: ["ns1.masidy.cloud", "ns2.masidy.cloud"], privacy: true },
];

const recordTypes = ["A", "AAAA", "CNAME", "MX", "TXT", "NS"] as const;

let nextDomId = 6;
let nextRecId = 10;

export function DomainsPage() {
  const [domains, setDomains] = useState(initialDomains);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "dns" | "ssl" | "settings">("overview");

  /* Register modal */
  const [showRegister, setShowRegister] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [checkResult, setCheckResult] = useState<"available" | "taken" | null>(null);
  const [checking, setChecking] = useState(false);

  /* DNS editor */
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecType, setNewRecType] = useState<DnsRecord["type"]>("A");
  const [newRecName, setNewRecName] = useState("");
  const [newRecValue, setNewRecValue] = useState("");
  const [newRecTtl, setNewRecTtl] = useState("3600");
  const [newRecPriority, setNewRecPriority] = useState("10");

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const selectedDomain = domains.find((d) => d.id === selected);

  const toggleStatusFilter = (s: string) => setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  const filtered = domains.filter((d) => {
    if (statusFilter.length > 0 && !statusFilter.includes(d.status)) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const checkDomain = useCallback(() => {
    if (!newDomain.trim()) return;
    setChecking(true);
    setCheckResult(null);
    setTimeout(() => {
      const taken = initialDomains.some((d) => d.name === newDomain.trim().toLowerCase());
      setCheckResult(taken ? "taken" : "available");
      setChecking(false);
    }, 1200);
  }, [newDomain]);

  const registerDomain = useCallback(() => {
    if (!newDomain.trim() || checkResult !== "available") return;
    const dom: Domain = { id: `dom-${String(nextDomId++).padStart(3, "0")}`, name: newDomain.trim().toLowerCase(), status: "pending", registrar: "Masidy Domains", expires: "2027-01-20", autoRenew: true, ssl: "none", dns: [], nameservers: ["ns1.masidy.cloud", "ns2.masidy.cloud"], privacy: true };
    setDomains((prev) => [dom, ...prev]);
    setShowRegister(false);
    setNewDomain("");
    setCheckResult(null);
    setSelected(dom.id);
    setTimeout(() => { setDomains((prev) => prev.map((d) => d.id === dom.id ? { ...d, status: "active", ssl: "valid", sslExpires: "2026-01-20", dns: makeDns(dom.name) } : d)); }, 3000);
  }, [newDomain, checkResult]);

  const toggleAutoRenew = useCallback((id: string) => {
    setDomains((prev) => prev.map((d) => d.id === id ? { ...d, autoRenew: !d.autoRenew } : d));
  }, []);

  const togglePrivacy = useCallback((id: string) => {
    setDomains((prev) => prev.map((d) => d.id === id ? { ...d, privacy: !d.privacy } : d));
  }, []);

  const addDnsRecord = useCallback(() => {
    if (!selected || !newRecName.trim() || !newRecValue.trim()) return;
    const record: DnsRecord = { id: `r${nextRecId++}`, type: newRecType, name: newRecName.trim(), value: newRecValue.trim(), ttl: parseInt(newRecTtl) || 3600, ...(newRecType === "MX" ? { priority: parseInt(newRecPriority) || 10 } : {}) };
    setDomains((prev) => prev.map((d) => d.id === selected ? { ...d, dns: [...d.dns, record] } : d));
    setShowAddRecord(false);
    setNewRecName("");
    setNewRecValue("");
  }, [selected, newRecType, newRecName, newRecValue, newRecTtl, newRecPriority]);

  const deleteDnsRecord = useCallback((recId: string) => {
    if (!selected) return;
    setDomains((prev) => prev.map((d) => d.id === selected ? { ...d, dns: d.dns.filter((r) => r.id !== recId) } : d));
  }, [selected]);

  const deleteDomain = useCallback((id: string) => {
    setDomains((prev) => prev.filter((d) => d.id !== id));
    if (selected === id) setSelected(null);
    setConfirmDelete(null);
  }, [selected]);

  const activeCount = domains.filter((d) => d.status === "active").length;
  const expiringCount = domains.filter((d) => d.ssl === "expiring").length;

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Domains</h1>
          <p className="text-sm text-app-text-muted mt-1">{domains.length} domains &middot; {activeCount} active{expiringCount > 0 && <span className="text-amber-500"> &middot; {expiringCount} SSL expiring</span>}</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowRegister(true)} className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors flex items-center gap-2 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
          Register Domain
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Domains", value: domains.length, icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9", accent: "var(--app-accent)" },
          { label: "Active", value: activeCount, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent: "#10b981" },
          { label: "SSL Certificates", value: domains.filter((d) => d.ssl !== "none").length, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", accent: "#3b82f6" },
          { label: "Auto-Renew", value: domains.filter((d) => d.autoRenew).length, icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", accent: "#a855f7" },
        ].map((s, i) => (
          <motion.div key={s.label} className="bg-app-card border border-app-border rounded-xl p-4" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="flex items-center gap-3 mb-2"><div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={s.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={s.icon} /></svg></div><span className="text-xs text-app-text-muted">{s.label}</span></div>
            <span className="text-2xl font-bold text-app-text">{s.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(["active", "pending", "expired", "transferring"] as const).map((s) => (
            <button key={s} onClick={() => toggleStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter.includes(s) ? `${statusConfig[s].bg} ${statusConfig[s].text}` : "bg-app-card border border-app-border text-app-text-muted"}`}>{s}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search domains..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-app-card border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Domain List */}
        <div className={`${selectedDomain ? "w-1/3" : "w-full"} transition-all`}>
          <div className="space-y-2">
            {filtered.map((dom, i) => {
              const sc = statusConfig[dom.status];
              const sl = sslConfig[dom.ssl];
              return (
                <motion.div key={dom.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => { setSelected(dom.id); setActiveTab("overview"); }} className={`bg-app-card border rounded-xl p-4 cursor-pointer transition-all ${selected === dom.id ? "border-app-accent/40 ring-1 ring-app-accent/20" : "border-app-border hover:border-app-accent/20"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-app-text">{dom.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>{sc.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-app-text-muted">
                    <span className={`flex items-center gap-1 ${sl.text}`}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>{sl.label}</span>
                    <span>Exp: {dom.expires}</span>
                    {dom.autoRenew && <span className="text-purple-400">Auto-renew</span>}
                  </div>
                  {!selectedDomain && dom.project && <div className="mt-2 text-xs text-app-text-muted">Linked: <span className="text-app-text-secondary">{dom.project}</span></div>}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedDomain && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "67%" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="bg-app-card border border-app-border rounded-xl overflow-hidden h-full">
                <div className="flex items-center justify-between px-5 py-3 border-b border-app-border">
                  <div>
                    <div className="font-semibold text-app-text text-lg">{selectedDomain.name}</div>
                    <div className="text-xs text-app-text-muted">{selectedDomain.registrar} &middot; Expires {selectedDomain.expires}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setConfirmDelete(selectedDomain.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                    <button onClick={() => setSelected(null)} className="text-app-text-muted hover:text-app-text ml-1">&times;</button>
                  </div>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-app-border px-5">
                  {(["overview", "dns", "ssl", "settings"] as const).map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? "text-app-accent-text border-app-accent" : "text-app-text-muted border-transparent hover:text-app-text"}`}>{t === "dns" ? "DNS Records" : t === "ssl" ? "SSL / TLS" : t}</button>
                  ))}
                </div>

                <div className="p-5 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                  {/* Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { l: "Status", v: statusConfig[selectedDomain.status].label, c: statusConfig[selectedDomain.status].text },
                          { l: "SSL", v: sslConfig[selectedDomain.ssl].label, c: sslConfig[selectedDomain.ssl].text },
                          { l: "Registrar", v: selectedDomain.registrar },
                          { l: "Auto-Renew", v: selectedDomain.autoRenew ? "Enabled" : "Disabled", c: selectedDomain.autoRenew ? "text-emerald-500" : "text-app-text-muted" },
                          { l: "WHOIS Privacy", v: selectedDomain.privacy ? "Enabled" : "Disabled", c: selectedDomain.privacy ? "text-emerald-500" : "text-app-text-muted" },
                          { l: "DNS Records", v: `${selectedDomain.dns.length} records` },
                        ].map((item) => (
                          <div key={item.l} className="bg-app-bg rounded-lg p-3 border border-app-border/50">
                            <div className="text-[10px] text-app-text-muted uppercase tracking-wider">{item.l}</div>
                            <div className={`text-sm font-semibold mt-0.5 ${item.c || "text-app-text"}`}>{item.v}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-app-text-muted mb-2 uppercase tracking-wider">Nameservers</div>
                        <div className="space-y-1">
                          {selectedDomain.nameservers.map((ns) => (
                            <div key={ns} className="bg-app-bg border border-app-border/50 rounded-lg px-3 py-2 font-mono text-xs text-app-text-secondary">{ns}</div>
                          ))}
                        </div>
                      </div>
                      {selectedDomain.project && (
                        <div className="bg-app-bg rounded-lg p-3 border border-app-border/50">
                          <div className="text-[10px] text-app-text-muted uppercase tracking-wider">Linked Project</div>
                          <div className="text-sm font-semibold text-app-text mt-0.5">{selectedDomain.project}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DNS */}
                  {activeTab === "dns" && (
                    <div className="space-y-4">
                      <button onClick={() => setShowAddRecord(!showAddRecord)} className="px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text text-xs font-medium hover:bg-app-btn-primary-hover transition-colors flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>Add Record
                      </button>
                      <AnimatePresence>
                        {showAddRecord && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                            <div className="bg-app-bg border border-app-border rounded-lg p-4 space-y-3">
                              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                                <div><label className="text-[10px] text-app-text-muted mb-1 block">Type</label><select value={newRecType} onChange={(e) => setNewRecType(e.target.value as DnsRecord["type"])} className="w-full px-2 py-1.5 rounded bg-app-card border border-app-border text-app-text text-xs">{recordTypes.map((t) => <option key={t}>{t}</option>)}</select></div>
                                <div><label className="text-[10px] text-app-text-muted mb-1 block">Name</label><input value={newRecName} onChange={(e) => setNewRecName(e.target.value)} placeholder="@" className="w-full px-2 py-1.5 rounded bg-app-card border border-app-border text-app-text text-xs" /></div>
                                <div><label className="text-[10px] text-app-text-muted mb-1 block">Value</label><input value={newRecValue} onChange={(e) => setNewRecValue(e.target.value)} placeholder="203.0.113.1" className="w-full px-2 py-1.5 rounded bg-app-card border border-app-border text-app-text text-xs" /></div>
                                <div><label className="text-[10px] text-app-text-muted mb-1 block">TTL</label><input value={newRecTtl} onChange={(e) => setNewRecTtl(e.target.value)} className="w-full px-2 py-1.5 rounded bg-app-card border border-app-border text-app-text text-xs" /></div>
                                {newRecType === "MX" && <div><label className="text-[10px] text-app-text-muted mb-1 block">Priority</label><input value={newRecPriority} onChange={(e) => setNewRecPriority(e.target.value)} className="w-full px-2 py-1.5 rounded bg-app-card border border-app-border text-app-text text-xs" /></div>}
                              </div>
                              <div className="flex gap-2"><button onClick={addDnsRecord} disabled={!newRecName.trim() || !newRecValue.trim()} className="px-3 py-1.5 rounded bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 disabled:opacity-40">Add</button><button onClick={() => setShowAddRecord(false)} className="px-3 py-1.5 rounded bg-app-card border border-app-border text-app-text-muted text-xs">Cancel</button></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {selectedDomain.dns.length > 0 ? (
                        <div className="bg-app-bg border border-app-border rounded-lg overflow-hidden">
                          <table className="w-full text-xs">
                            <thead><tr className="border-b border-app-border text-app-text-muted uppercase tracking-wider"><th className="px-4 py-2 text-left">Type</th><th className="px-4 py-2 text-left">Name</th><th className="px-4 py-2 text-left">Value</th><th className="px-4 py-2 text-left">TTL</th><th className="px-4 py-2" /></tr></thead>
                            <tbody>{selectedDomain.dns.map((r) => (
                              <tr key={r.id} className="border-b border-app-border/30 hover:bg-app-accent/5">
                                <td className="px-4 py-2"><span className="px-1.5 py-0.5 rounded bg-app-accent/10 text-app-accent-text text-[10px] font-medium">{r.type}</span></td>
                                <td className="px-4 py-2 font-mono text-app-text">{r.name}</td>
                                <td className="px-4 py-2 font-mono text-app-text-secondary truncate max-w-[200px]">{r.priority ? `${r.priority} ` : ""}{r.value}</td>
                                <td className="px-4 py-2 text-app-text-muted">{r.ttl}s</td>
                                <td className="px-4 py-2 text-right"><button onClick={() => deleteDnsRecord(r.id)} className="text-red-400/60 hover:text-red-400">Delete</button></td>
                              </tr>
                            ))}</tbody>
                          </table>
                        </div>
                      ) : <div className="text-xs text-app-text-muted text-center py-8">No DNS records configured</div>}
                    </div>
                  )}

                  {/* SSL */}
                  {activeTab === "ssl" && (
                    <div className="space-y-4">
                      <div className={`rounded-lg p-4 border ${selectedDomain.ssl === "valid" ? "border-emerald-500/30 bg-emerald-500/5" : selectedDomain.ssl === "expiring" ? "border-amber-500/30 bg-amber-500/5" : "border-app-border bg-app-bg"}`}>
                        <div className="flex items-center gap-3 mb-2">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={selectedDomain.ssl === "valid" ? "#10b981" : selectedDomain.ssl === "expiring" ? "#f59e0b" : "#6b7280"} strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                          <div><div className={`text-sm font-semibold ${sslConfig[selectedDomain.ssl].text}`}>{sslConfig[selectedDomain.ssl].label}</div>{selectedDomain.sslExpires && <div className="text-xs text-app-text-muted">Expires: {selectedDomain.sslExpires}</div>}</div>
                        </div>
                      </div>
                      {selectedDomain.ssl === "none" && (
                        <button className="px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text text-xs font-medium hover:bg-app-btn-primary-hover">Provision SSL Certificate</button>
                      )}
                      {selectedDomain.ssl === "expiring" && (
                        <button className="px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-medium hover:bg-amber-500/20">Renew Certificate</button>
                      )}
                      <div className="space-y-2 text-xs">
                        {[{ k: "Issuer", v: "Masidy Cloud CA" }, { k: "Type", v: "Let's Encrypt - Wildcard" }, { k: "Coverage", v: `*.${selectedDomain.name}, ${selectedDomain.name}` }, { k: "Protocol", v: "TLS 1.3" }].map(({ k, v }) => (
                          <div key={k} className="flex justify-between py-1.5 border-b border-app-border/30"><span className="text-app-text-muted">{k}</span><span className="text-app-text">{v}</span></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Settings */}
                  {activeTab === "settings" && (
                    <div className="space-y-4">
                      {[
                        { label: "Auto-Renew", desc: "Automatically renew this domain before expiration", value: selectedDomain.autoRenew, toggle: () => toggleAutoRenew(selectedDomain.id) },
                        { label: "WHOIS Privacy", desc: "Hide personal information from WHOIS lookups", value: selectedDomain.privacy, toggle: () => togglePrivacy(selectedDomain.id) },
                      ].map((setting) => (
                        <div key={setting.label} className="flex items-center justify-between bg-app-bg rounded-lg p-4 border border-app-border/50">
                          <div><div className="text-sm font-medium text-app-text">{setting.label}</div><div className="text-xs text-app-text-muted mt-0.5">{setting.desc}</div></div>
                          <button onClick={setting.toggle} className={`w-10 h-6 rounded-full transition-colors relative ${setting.value ? "bg-emerald-500" : "bg-gray-600"}`}>
                            <motion.div className="w-4 h-4 rounded-full bg-white absolute top-1" animate={{ left: setting.value ? 22 : 4 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                          </button>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-app-border">
                        <button onClick={() => setConfirmDelete(selectedDomain.id)} className="w-full text-xs text-red-400 border border-red-400/20 rounded-lg py-3 hover:bg-red-500/10 transition-colors">Delete Domain</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Register Modal */}
      <AnimatePresence>
        {showRegister && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-app-card border border-app-border rounded-2xl p-6 mx-4 max-w-md w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-app-text mb-4">Register Domain</h3>
              <div className="flex gap-2 mb-4">
                <input value={newDomain} onChange={(e) => { setNewDomain(e.target.value); setCheckResult(null); }} placeholder="example.com" className="flex-1 px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" onKeyDown={(e) => e.key === "Enter" && checkDomain()} />
                <button onClick={checkDomain} disabled={checking || !newDomain.trim()} className="px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text text-sm font-medium hover:bg-app-btn-primary-hover disabled:opacity-40">
                  {checking ? "Checking..." : "Check"}
                </button>
              </div>
              {checkResult && (
                <div className={`rounded-lg p-3 mb-4 text-sm ${checkResult === "available" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-400"}`}>
                  {checkResult === "available" ? `${newDomain} is available!` : `${newDomain} is already taken.`}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => { setShowRegister(false); setNewDomain(""); setCheckResult(null); }} className="flex-1 px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-secondary text-sm hover:text-app-text">Cancel</button>
                <button onClick={registerDomain} disabled={checkResult !== "available"} className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm font-medium hover:bg-emerald-500/20 disabled:opacity-40">Register</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-app-card border border-app-border rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-app-text mb-2">Delete Domain</h3>
              <p className="text-sm text-app-text-muted mb-6">Are you sure you want to delete <span className="font-medium text-app-text">{domains.find((d) => d.id === confirmDelete)?.name}</span>? This will remove all DNS records and SSL certificates.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-secondary text-sm hover:text-app-text">Cancel</button>
                <button onClick={() => deleteDomain(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
