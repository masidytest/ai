"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── types ─── */
interface Database {
  id: string;
  name: string;
  engine: "PostgreSQL" | "MongoDB" | "MySQL" | "Redis";
  status: "active" | "paused" | "error";
  region: string;
  size: string;
  sizeBytes: number;
  tables: number;
  connections: number;
  maxConn: number;
  queriesPerHour: number;
  created: string;
  version: string;
  host: string;
  port: number;
}

interface QueryResult {
  query: string;
  rows: Record<string, string | number>[];
  duration: number;
  rowCount: number;
}

/* ─── data ─── */
const initialDbs: Database[] = [
  { id: "db-001", name: "production-db", engine: "PostgreSQL", status: "active", region: "US East", size: "2.4 GB", sizeBytes: 2576980378, tables: 34, connections: 18, maxConn: 100, queriesPerHour: 12400, created: "2025-08-12", version: "16.2", host: "pg-prod.masidy.cloud", port: 5432 },
  { id: "db-002", name: "staging-db", engine: "PostgreSQL", status: "active", region: "US East", size: "890 MB", sizeBytes: 933232640, tables: 34, connections: 5, maxConn: 50, queriesPerHour: 2100, created: "2025-09-01", version: "16.2", host: "pg-staging.masidy.cloud", port: 5432 },
  { id: "db-003", name: "analytics-store", engine: "MongoDB", status: "active", region: "EU West", size: "5.1 GB", sizeBytes: 5476083302, tables: 12, connections: 8, maxConn: 200, queriesPerHour: 8900, created: "2025-07-20", version: "7.0", host: "mongo-analytics.masidy.cloud", port: 27017 },
  { id: "db-004", name: "cache-layer", engine: "Redis", status: "active", region: "US East", size: "128 MB", sizeBytes: 134217728, tables: 0, connections: 42, maxConn: 1000, queriesPerHour: 45200, created: "2025-10-05", version: "7.2", host: "redis-cache.masidy.cloud", port: 6379 },
  { id: "db-005", name: "legacy-backup", engine: "MySQL", status: "paused", region: "US West", size: "1.2 GB", sizeBytes: 1288490189, tables: 18, connections: 0, maxConn: 50, queriesPerHour: 0, created: "2025-03-15", version: "8.0", host: "mysql-legacy.masidy.cloud", port: 3306 },
];

const engines = ["All", "PostgreSQL", "MongoDB", "MySQL", "Redis"] as const;
const statusColor: Record<string, { bg: string; text: string }> = { active: { bg: "bg-emerald-500/10", text: "text-emerald-500" }, paused: { bg: "bg-amber-500/10", text: "text-amber-500" }, error: { bg: "bg-red-500/10", text: "text-red-400" } };
const engineColor: Record<string, { bg: string; text: string; accent: string }> = {
  PostgreSQL: { bg: "bg-blue-500/10", text: "text-blue-400", accent: "#3b82f6" },
  MongoDB: { bg: "bg-emerald-500/10", text: "text-emerald-500", accent: "#10b981" },
  MySQL: { bg: "bg-orange-500/10", text: "text-orange-400", accent: "#f97316" },
  Redis: { bg: "bg-red-500/10", text: "text-red-400", accent: "#ef4444" },
};

/* sample query results */
const sampleResults: Record<string, QueryResult> = {
  "SELECT * FROM users LIMIT 5;": { query: "SELECT * FROM users LIMIT 5;", duration: 12, rowCount: 5, rows: [
    { id: 1, email: "alice@masidy.com", role: "admin", created: "2025-01-15" },
    { id: 2, email: "bob@masidy.com", role: "user", created: "2025-02-20" },
    { id: 3, email: "carol@masidy.com", role: "user", created: "2025-03-10" },
    { id: 4, email: "dave@masidy.com", role: "editor", created: "2025-04-05" },
    { id: 5, email: "eve@masidy.com", role: "user", created: "2025-05-01" },
  ] },
  "SELECT COUNT(*) as total FROM orders;": { query: "SELECT COUNT(*) as total FROM orders;", duration: 3, rowCount: 1, rows: [{ total: 15234 }] },
  "SHOW TABLES;": { query: "SHOW TABLES;", duration: 1, rowCount: 6, rows: [
    { table_name: "users" }, { table_name: "orders" }, { table_name: "products" }, { table_name: "sessions" }, { table_name: "payments" }, { table_name: "logs" },
  ] },
};

let nextId = 6;

export function DatabasePage() {
  const [databases, setDatabases] = useState(initialDbs);
  const [filter, setFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "query" | "schema" | "backups">("overview");
  const [queryText, setQueryText] = useState("SELECT * FROM users LIMIT 5;");
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [connStringVisible, setConnStringVisible] = useState(false);

  /* Create form */
  const [newName, setNewName] = useState("");
  const [newEngine, setNewEngine] = useState<Database["engine"]>("PostgreSQL");
  const [newRegion, setNewRegion] = useState("US East");

  const filtered = databases.filter((db) => {
    if (filter !== "All" && db.engine !== filter) return false;
    if (search && !db.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedDb = databases.find((d) => d.id === selected);

  const createDb = useCallback(() => {
    if (!newName.trim()) return;
    const portMap: Record<string, number> = { PostgreSQL: 5432, MongoDB: 27017, MySQL: 3306, Redis: 6379 };
    const versionMap: Record<string, string> = { PostgreSQL: "16.2", MongoDB: "7.0", MySQL: "8.0", Redis: "7.2" };
    const db: Database = { id: `db-${String(nextId++).padStart(3, "0")}`, name: newName.trim(), engine: newEngine, status: "active", region: newRegion, size: "0 MB", sizeBytes: 0, tables: 0, connections: 0, maxConn: newEngine === "Redis" ? 1000 : 100, queriesPerHour: 0, created: new Date().toISOString().split("T")[0], version: versionMap[newEngine], host: `${newEngine.toLowerCase()}-${newName.trim()}.masidy.cloud`, port: portMap[newEngine] };
    setDatabases((prev) => [db, ...prev]);
    setShowCreate(false);
    setNewName("");
    setSelected(db.id);
  }, [newName, newEngine, newRegion]);

  const deleteDb = useCallback((id: string) => {
    setDatabases((prev) => prev.filter((d) => d.id !== id));
    if (selected === id) setSelected(null);
    setConfirmDelete(null);
  }, [selected]);

  const togglePause = useCallback((id: string) => {
    setDatabases((prev) => prev.map((d) => d.id === id ? { ...d, status: d.status === "active" ? "paused" as const : "active" as const, connections: d.status === "active" ? 0 : 3, queriesPerHour: d.status === "active" ? 0 : 500 } : d));
  }, []);

  const runQuery = useCallback(() => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    const result = sampleResults[trimmed] || { query: trimmed, duration: Math.floor(Math.random() * 50) + 1, rowCount: 0, rows: [] };
    setQueryResult(result);
    setQueryHistory((prev) => [trimmed, ...prev.filter((q) => q !== trimmed)].slice(0, 10));
  }, [queryText]);

  const totalStorage = databases.reduce((a, d) => a + d.sizeBytes, 0);
  const activeCount = databases.filter((d) => d.status === "active").length;

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Databases</h1>
          <p className="text-sm text-app-text-muted mt-1">{databases.length} instances &middot; {activeCount} active &middot; {(totalStorage / 1e9).toFixed(1)} GB total</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreate(!showCreate)} className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors flex items-center gap-2 text-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Database
        </motion.button>
      </div>

      {/* Create Panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: "auto", marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
            <div className="bg-app-card border border-app-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-app-text mb-4">Create Database Instance</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div><label className="block text-xs text-app-text-muted mb-1.5">Name</label><input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="my-database" className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" /></div>
                <div><label className="block text-xs text-app-text-muted mb-1.5">Engine</label><select value={newEngine} onChange={(e) => setNewEngine(e.target.value as Database["engine"])} className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-app-accent/50"><option>PostgreSQL</option><option>MongoDB</option><option>MySQL</option><option>Redis</option></select></div>
                <div><label className="block text-xs text-app-text-muted mb-1.5">Region</label><select value={newRegion} onChange={(e) => setNewRegion(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm focus:outline-none focus:border-app-accent/50"><option>US East</option><option>US West</option><option>EU West</option><option>Asia Pacific</option></select></div>
                <div className="flex items-end gap-2"><button onClick={createDb} disabled={!newName.trim()} className="flex-1 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium text-sm hover:bg-emerald-500/20 disabled:opacity-40">Create</button><button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-muted text-sm hover:text-app-text">Cancel</button></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Databases", value: databases.length, icon: "M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7", accent: "var(--app-accent)" },
          { label: "Active", value: activeCount, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", accent: "#10b981" },
          { label: "Total Storage", value: `${(totalStorage / 1e9).toFixed(1)} GB`, icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z", accent: "#3b82f6" },
          { label: "Queries / hr", value: `${(databases.reduce((a, d) => a + d.queriesPerHour, 0) / 1000).toFixed(1)}K`, icon: "M13 10V3L4 14h7v7l9-11h-7z", accent: "#a855f7" },
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
          {engines.map((e) => (
            <button key={e} onClick={() => setFilter(e)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === e ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30" : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text"}`}>{e}</button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search databases..." className="w-full pl-9 pr-4 py-2 rounded-lg bg-app-card border border-app-border text-app-text placeholder:text-app-text-muted text-sm focus:outline-none focus:border-app-accent/50" />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Database List */}
        <div className={`${selectedDb ? "w-1/3" : "w-full"} transition-all`}>
          <div className="space-y-2">
            {filtered.map((db, i) => {
              const ec = engineColor[db.engine];
              const sc = statusColor[db.status];
              return (
                <motion.div key={db.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} onClick={() => { setSelected(db.id); setActiveTab("overview"); }} className={`bg-app-card border rounded-xl p-4 cursor-pointer transition-all ${selected === db.id ? "border-app-accent/40 ring-1 ring-app-accent/20" : "border-app-border hover:border-app-accent/20"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg ${ec.bg} flex items-center justify-center shrink-0`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={ec.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" /></svg></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="text-sm font-semibold text-app-text truncate">{db.name}</span><span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sc.bg} ${sc.text}`}>{db.status}</span></div>
                      <div className="text-xs text-app-text-muted mt-0.5">{db.engine} {db.version} &middot; {db.region} &middot; {db.size}</div>
                    </div>
                  </div>
                  {!selectedDb && (
                    <div className="flex gap-4 mt-3 text-xs text-app-text-muted">
                      <span>{db.tables} tables</span><span>{db.connections}/{db.maxConn} conn</span><span>{db.queriesPerHour.toLocaleString()} q/hr</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedDb && (
            <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "67%" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="bg-app-card border border-app-border rounded-xl overflow-hidden h-full">
                {/* Detail header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-app-border">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${engineColor[selectedDb.engine].bg} flex items-center justify-center`}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={engineColor[selectedDb.engine].accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" /></svg></div>
                    <div><div className="font-semibold text-app-text">{selectedDb.name}</div><div className="text-xs text-app-text-muted">{selectedDb.engine} {selectedDb.version}</div></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => togglePause(selectedDb.id)} className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${selectedDb.status === "active" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"}`}>{selectedDb.status === "active" ? "Pause" : "Resume"}</button>
                    <button onClick={() => setConfirmDelete(selectedDb.id)} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">Delete</button>
                    <button onClick={() => setSelected(null)} className="text-app-text-muted hover:text-app-text ml-1">&times;</button>
                  </div>
                </div>
                {/* Tabs */}
                <div className="flex border-b border-app-border px-5">
                  {(["overview", "query", "schema", "backups"] as const).map((t) => (
                    <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2.5 text-xs font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === t ? "text-app-accent-text border-app-accent" : "text-app-text-muted border-transparent hover:text-app-text"}`}>{t}</button>
                  ))}
                </div>

                <div className="p-5 overflow-y-auto" style={{ maxHeight: "60vh" }}>
                  {/* Overview */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                          { l: "Tables", v: selectedDb.tables },
                          { l: "Connections", v: `${selectedDb.connections}/${selectedDb.maxConn}` },
                          { l: "Queries/hr", v: selectedDb.queriesPerHour.toLocaleString() },
                          { l: "Storage", v: selectedDb.size },
                        ].map((m) => (
                          <div key={m.l} className="bg-app-bg rounded-lg p-3 border border-app-border/50">
                            <div className="text-[10px] text-app-text-muted uppercase tracking-wider">{m.l}</div>
                            <div className="text-lg font-bold text-app-text mt-1">{m.v}</div>
                          </div>
                        ))}
                      </div>
                      {/* Connection string */}
                      <div>
                        <div className="flex items-center justify-between mb-2"><span className="text-xs font-medium text-app-text-muted uppercase tracking-wider">Connection String</span><button onClick={() => setConnStringVisible(!connStringVisible)} className="text-xs text-app-accent-text hover:underline">{connStringVisible ? "Hide" : "Show"}</button></div>
                        <div className="bg-app-bg border border-app-border rounded-lg px-3 py-2 font-mono text-xs text-app-text-secondary">
                          {connStringVisible ? `${selectedDb.engine.toLowerCase()}://<user>:<password>@${selectedDb.host}:${selectedDb.port}/${selectedDb.name}` : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
                        </div>
                      </div>
                      {/* Details */}
                      <div className="space-y-2">
                        {[{ k: "Host", v: selectedDb.host }, { k: "Port", v: selectedDb.port }, { k: "Region", v: selectedDb.region }, { k: "Created", v: selectedDb.created }].map(({ k, v }) => (
                          <div key={k} className="flex justify-between text-xs py-1.5 border-b border-app-border/30"><span className="text-app-text-muted">{k}</span><span className="text-app-text font-medium">{v}</span></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Query Console */}
                  {activeTab === "query" && (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2"><span className="text-xs text-app-text-muted font-medium">SQL Console</span>
                          <div className="flex gap-1">
                            {queryHistory.length > 0 && queryHistory.slice(0, 3).map((q, i) => (
                              <button key={i} onClick={() => setQueryText(q)} className="text-[10px] px-2 py-0.5 rounded bg-app-bg border border-app-border text-app-text-muted hover:text-app-text truncate max-w-[120px]">{q}</button>
                            ))}
                          </div>
                        </div>
                        <textarea value={queryText} onChange={(e) => setQueryText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) runQuery(); }} rows={4} className="w-full bg-app-bg border border-app-border rounded-lg px-3 py-2 font-mono text-xs text-app-text resize-none focus:outline-none focus:border-app-accent/50" placeholder="Enter SQL query..." />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[10px] text-app-text-muted">Ctrl+Enter to execute</span>
                          <button onClick={runQuery} className="px-4 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-medium hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>Execute
                          </button>
                        </div>
                      </div>
                      {queryResult && (
                        <div>
                          <div className="flex items-center gap-4 text-xs text-app-text-muted mb-2">
                            <span>{queryResult.rowCount} rows</span><span>{queryResult.duration}ms</span>
                          </div>
                          {queryResult.rows.length > 0 ? (
                            <div className="overflow-x-auto bg-app-bg border border-app-border rounded-lg">
                              <table className="w-full text-xs"><thead><tr className="border-b border-app-border">{Object.keys(queryResult.rows[0]).map((k) => <th key={k} className="px-3 py-2 text-left font-medium text-app-text-muted uppercase tracking-wider">{k}</th>)}</tr></thead>
                              <tbody>{queryResult.rows.map((row, i) => <tr key={i} className="border-b border-app-border/30 hover:bg-app-accent/5">{Object.values(row).map((v, j) => <td key={j} className="px-3 py-2 text-app-text-secondary">{String(v)}</td>)}</tr>)}</tbody></table>
                            </div>
                          ) : <div className="text-xs text-app-text-muted text-center py-4">Query returned no results</div>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schema */}
                  {activeTab === "schema" && (
                    <div className="space-y-3">
                      {["users", "orders", "products", "sessions", "payments", "logs"].map((table) => (
                        <div key={table} className="bg-app-bg border border-app-border rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /></svg><span className="text-xs font-semibold text-app-text">{table}</span></div>
                          <div className="grid grid-cols-2 gap-1 text-[10px] text-app-text-muted">
                            <span>id (int, PK)</span><span>created_at (timestamp)</span><span>updated_at (timestamp)</span><span>name (varchar 255)</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Backups */}
                  {activeTab === "backups" && (
                    <div className="space-y-3">
                      <button className="px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text text-xs font-medium hover:bg-app-btn-primary-hover transition-colors">Create Backup Now</button>
                      {[
                        { date: "2025-01-15 03:00", size: "2.3 GB", status: "completed" },
                        { date: "2025-01-14 03:00", size: "2.3 GB", status: "completed" },
                        { date: "2025-01-13 03:00", size: "2.2 GB", status: "completed" },
                        { date: "2025-01-12 03:00", size: "2.2 GB", status: "completed" },
                      ].map((b, i) => (
                        <div key={i} className="flex items-center justify-between bg-app-bg border border-app-border rounded-lg px-4 py-3">
                          <div><div className="text-xs font-medium text-app-text">{b.date}</div><div className="text-[10px] text-app-text-muted">{b.size}</div></div>
                          <div className="flex items-center gap-2"><span className="text-[10px] text-emerald-500">{b.status}</span><button className="text-xs text-app-accent-text hover:underline">Restore</button><button className="text-xs text-app-text-muted hover:text-app-text">Download</button></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-app-card border border-app-border rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-app-text mb-2">Delete Database</h3>
              <p className="text-sm text-app-text-muted mb-6">Are you sure you want to delete <span className="font-medium text-app-text">{databases.find((d) => d.id === confirmDelete)?.name}</span>? All data will be permanently lost.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 px-4 py-2 rounded-lg bg-app-bg border border-app-border text-app-text-secondary text-sm hover:text-app-text">Cancel</button>
                <button onClick={() => deleteDb(confirmDelete)} className="flex-1 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
