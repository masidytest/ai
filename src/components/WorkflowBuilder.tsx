"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResizeHandle, useResizable } from "./ui/ResizablePanel";

/* ─── types ─── */
interface WfNode {
  id: string;
  type: "trigger" | "action" | "condition" | "output" | "delay" | "webhook" | "transform";
  label: string;
  x: number;
  y: number;
  config: Record<string, string>;
}

interface WfEdge {
  from: string;
  to: string;
  label?: string;
}

interface LogEntry {
  ts: string;
  node: string;
  type: "info" | "success" | "error" | "warn";
  text: string;
}

/* ─── templates ─── */
const nodeTypes: { type: WfNode["type"]; label: string; color: string; icon: string; defaults: Record<string, string> }[] = [
  { type: "trigger", label: "Trigger", color: "emerald", icon: "M13 10V3L4 14h7v7l9-11h-7z", defaults: { event: "git.push", branch: "main" } },
  { type: "action", label: "Action", color: "blue", icon: "M4 4v5h.58a4.97 4.97 0 012.84-2.84V4H4zM20 4h-5v2.16A4.97 4.97 0 0117.42 9H20V4z", defaults: { command: "npm run build", timeout: "300" } },
  { type: "condition", label: "Condition", color: "amber", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01", defaults: { expression: "status === 'success'", true_branch: "deploy", false_branch: "notify" } },
  { type: "output", label: "Output", color: "purple", icon: "M9 5l7 7-7 7", defaults: { destination: "slack", channel: "#deployments" } },
  { type: "delay", label: "Delay", color: "rose", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", defaults: { duration: "30", unit: "seconds" } },
  { type: "webhook", label: "Webhook", color: "cyan", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4", defaults: { url: "https://api.example.com/hook", method: "POST" } },
  { type: "transform", label: "Transform", color: "orange", icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", defaults: { mapping: "data.results", format: "json" } },
];

const colorMap: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-500", dot: "bg-emerald-500" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-500", dot: "bg-amber-500" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
  orange: { bg: "bg-orange-500/10", border: "border-orange-500/30", text: "text-orange-400", dot: "bg-orange-400" },
};

let nextNodeId = 1;
function ts() { return new Date().toLocaleTimeString("en-US", { hour12: false }); }

/* ─── initial workflow ─── */
const initNodes: WfNode[] = [
  { id: "n1", type: "trigger", label: "On Push to Main", x: 60, y: 60, config: { event: "git.push", branch: "main" } },
  { id: "n2", type: "action", label: "Run Tests", x: 60, y: 200, config: { command: "npm test", timeout: "120" } },
  { id: "n3", type: "condition", label: "Tests Passed?", x: 60, y: 340, config: { expression: "exit_code === 0", true_branch: "deploy", false_branch: "alert" } },
  { id: "n4", type: "action", label: "Build & Deploy", x: 280, y: 340, config: { command: "npm run build && deploy", timeout: "300" } },
  { id: "n5", type: "output", label: "Slack Notification", x: 280, y: 480, config: { destination: "slack", channel: "#deployments" } },
];
const initEdges: WfEdge[] = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4", label: "true" },
  { from: "n4", to: "n5" },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState<WfNode[]>(initNodes);
  const [edges, setEdges] = useState<WfEdge[]>(initEdges);
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [showConfig, setShowConfig] = useState(true);
  const [showLogs, setShowLogs] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [logs]);

  const getNodeColor = (node: WfNode) => {
    const nt = nodeTypes.find((t) => t.type === node.type);
    return colorMap[nt?.color ?? "blue"];
  };

  const addNode = useCallback((type: WfNode["type"]) => {
    const nt = nodeTypes.find((t) => t.type === type)!;
    const id = `n${++nextNodeId + 5}`;
    setNodes((prev) => [...prev, { id, type, label: `${nt.label} ${id}`, x: 120 + nodes.length * 30, y: 80 + nodes.length * 30, config: { ...nt.defaults } }]);
    setSelected(id);
  }, [nodes.length]);

  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.from !== id && e.to !== id));
    if (selected === id) setSelected(null);
  }, [selected]);

  const startConnect = useCallback((id: string) => {
    setConnecting(id);
  }, []);

  const finishConnect = useCallback((id: string) => {
    if (connecting && connecting !== id && !edges.find((e) => e.from === connecting && e.to === id)) {
      setEdges((prev) => [...prev, { from: connecting, to: id }]);
    }
    setConnecting(null);
  }, [connecting, edges]);

  const deleteEdge = useCallback((from: string, to: string) => {
    setEdges((prev) => prev.filter((e) => !(e.from === from && e.to === to)));
  }, []);

  const updateConfig = useCallback((key: string, value: string) => {
    if (!selected) return;
    setNodes((prev) => prev.map((n) => n.id === selected ? { ...n, config: { ...n.config, [key]: value } } : n));
  }, [selected]);

  const updateLabel = useCallback((value: string) => {
    if (!selected) return;
    setNodes((prev) => prev.map((n) => n.id === selected ? { ...n, label: value } : n));
  }, [selected]);

  /* Simulate workflow run */
  const runWorkflow = useCallback(() => {
    if (running) return;
    setRunning(true);
    setShowLogs(true);
    setLogs([]);

    const ordered = [...nodes];
    let delay = 0;
    ordered.forEach((node, i) => {
      delay += 600;
      setTimeout(() => {
        setLogs((prev) => [...prev, { ts: ts(), node: node.label, type: "info", text: `Executing ${node.type}: ${node.label}...` }]);
      }, delay);
      delay += 800;
      setTimeout(() => {
        const type = node.type === "condition" ? "warn" : "success";
        const text = node.type === "condition" ? `Evaluated: ${node.config.expression} => true` : `Completed in ${(Math.random() * 3 + 0.5).toFixed(1)}s`;
        setLogs((prev) => [...prev, { ts: ts(), node: node.label, type, text }]);
        if (i === ordered.length - 1) {
          setTimeout(() => {
            setLogs((prev) => [...prev, { ts: ts(), node: "Workflow", type: "success", text: "Workflow completed successfully" }]);
            setRunning(false);
          }, 400);
        }
      }, delay);
    });
  }, [nodes, running]);

  const selectedNode = nodes.find((n) => n.id === selected);

  /* Compute edge SVG paths */
  const edgePaths = edges.map((e) => {
    const from = nodes.find((n) => n.id === e.from);
    const to = nodes.find((n) => n.id === e.to);
    if (!from || !to) return null;
    const x1 = from.x + 100; // center of node
    const y1 = from.y + 30;
    const x2 = to.x + 100;
    const y2 = to.y + 30;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return { ...e, path: `M${x1},${y1} Q${mx},${y1} ${mx},${my} Q${mx},${y2} ${x2},${y2}`, mx, my };
  }).filter(Boolean) as (WfEdge & { path: string; mx: number; my: number })[];

  const logColor: Record<string, string> = { info: "text-blue-400", success: "text-emerald-400", error: "text-red-400", warn: "text-amber-400" };

  /* Resizable panels */
  const paletteR = useResizable({ initial: 190, min: 140, max: 320, storageKey: "wf-palette" });
  const logsR = useResizable({ initial: 180, min: 80, max: 400, storageKey: "wf-logs" });
  const configR = useResizable({ initial: 290, min: 200, max: 480, storageKey: "wf-config" });

  return (
    <div className="flex flex-col h-full bg-app-bg text-app-text overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-app-bg-secondary border-b border-app-border shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPalette(!showPalette)} className={`p-1.5 rounded-lg transition-colors ${showPalette ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="Palette">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <div className="h-4 w-px bg-app-border mx-1" />
          <button onClick={runWorkflow} disabled={running} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 transition-colors text-xs font-medium">
            {running ? (
              <><motion.svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}><path d="M12 2a10 10 0 00-10 10h3a7 7 0 017-7V2z"/></motion.svg>Running...</>
            ) : (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Run</>
            )}
          </button>
          <button onClick={() => { setNodes(initNodes); setEdges(initEdges); setSelected(null); setLogs([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-app-card border border-app-border text-app-text-muted hover:text-app-text transition-colors text-xs font-medium">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            Reset
          </button>
          <div className="h-4 w-px bg-app-border mx-1" />
          {connecting && (
            <span className="text-xs text-amber-500 animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Click a target node to connect
              <button onClick={() => setConnecting(null)} className="ml-1 text-app-text-muted hover:text-app-text">&times;</button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-app-text-muted">{nodes.length} nodes, {edges.length} edges</span>
          <div className="flex items-center bg-app-card rounded-lg border border-app-border overflow-hidden">
            <button onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} className="px-2 py-1 text-xs text-app-text-muted hover:text-app-text">&minus;</button>
            <span className="px-2 text-xs text-app-text border-x border-app-border">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className="px-2 py-1 text-xs text-app-text-muted hover:text-app-text">+</button>
          </div>
          <button onClick={() => setShowLogs(!showLogs)} className={`p-1.5 rounded-lg transition-colors ${showLogs ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="Logs">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          </button>
          <button onClick={() => setShowConfig(!showConfig)} className={`p-1.5 rounded-lg transition-colors ${showConfig ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="Config">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9"/></svg>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <AnimatePresence>
          {showPalette && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: paletteR.size, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-app-bg-secondary shrink-0 flex overflow-hidden">
              <div className="flex-1 overflow-y-auto border-r border-app-border">
              <div className="p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-3">Nodes</div>
                <div className="space-y-1">
                  {nodeTypes.map((nt) => {
                    const c = colorMap[nt.color];
                    return (
                      <button key={nt.type} onClick={() => addNode(nt.type)} className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:${c.bg} transition-colors group text-left`}>
                        <div className={`w-7 h-7 rounded-md ${c.bg} flex items-center justify-center shrink-0`}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={c.text}><path d={nt.icon}/></svg>
                        </div>
                        <span className="text-xs text-app-text-secondary group-hover:text-app-text">{nt.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-app-border">
                  <div className="text-[10px] text-app-text-muted mb-2">Tip: Click a node&apos;s port (dot) to start connecting, then click another node&apos;s port.</div>
                </div>
              </div>
              </div>
              <ResizeHandle direction="horizontal" onResize={paletteR.handleResize} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas + Logs */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Canvas */}
          <div ref={canvasRef} className="flex-1 overflow-auto relative" onClick={(e) => { if (e.target === e.currentTarget) { setSelected(null); setConnecting(null); } }}>
            <div style={{ transform: `scale(${zoom})`, transformOrigin: "top left", minWidth: 800, minHeight: 600, position: "relative" }}>
              {/* SVG edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                <defs>
                  <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="var(--app-accent)" opacity="0.5" /></marker>
                </defs>
                {edgePaths.map((ep) => (
                  <g key={`${ep.from}-${ep.to}`} style={{ pointerEvents: "all", cursor: "pointer" }} onClick={() => deleteEdge(ep.from, ep.to)}>
                    <path d={ep.path} fill="none" stroke="var(--app-accent)" strokeWidth="2" opacity="0.35" markerEnd="url(#arrowhead)" />
                    <path d={ep.path} fill="none" stroke="transparent" strokeWidth="12" />
                    {ep.label && (
                      <text x={ep.mx} y={ep.my - 6} textAnchor="middle" fill="var(--app-accent)" fontSize="10" fontWeight="600">{ep.label}</text>
                    )}
                  </g>
                ))}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const c = getNodeColor(node);
                const nt = nodeTypes.find((t) => t.type === node.type)!;
                return (
                  <motion.div
                    key={node.id}
                    drag
                    dragMomentum={false}
                    onDrag={(_, info) => {
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === node.id ? { ...n, x: Math.max(0, n.x + info.delta.x / zoom), y: Math.max(0, n.y + info.delta.y / zoom) } : n
                        )
                      );
                    }}
                    onClick={(e) => { e.stopPropagation(); if (connecting) { finishConnect(node.id); } else { setSelected(node.id); } }}
                    className={`absolute w-[200px] rounded-xl border ${c.border} ${c.bg} backdrop-blur-sm cursor-move select-none ${
                      selected === node.id ? "ring-2 ring-app-accent shadow-lg shadow-app-accent/10" : ""
                    } ${connecting ? "hover:ring-2 hover:ring-amber-500/50" : ""}`}
                    style={{ left: node.x, top: node.y, zIndex: selected === node.id ? 10 : 1 }}
                  >
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={c.text}><path d={nt.icon}/></svg>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-app-text truncate">{node.label}</div>
                        <div className={`text-[10px] ${c.text}`}>{nt.label}</div>
                      </div>
                    </div>
                    {/* Connection ports */}
                    <div
                      className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${c.dot} border-2 border-app-bg cursor-crosshair hover:scale-125 transition-transform`}
                      onClick={(e) => { e.stopPropagation(); startConnect(node.id); }}
                    />
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full ${c.dot} border-2 border-app-bg cursor-crosshair hover:scale-125 transition-transform opacity-50`}
                      onClick={(e) => { e.stopPropagation(); if (connecting) finishConnect(node.id); }}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Logs panel */}
          <AnimatePresence>
            {showLogs && (
              <motion.div initial={{ height: 0 }} animate={{ height: logsR.size }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="border-t border-app-border bg-app-bg-secondary shrink-0 overflow-hidden flex flex-col">
                <ResizeHandle direction="vertical" onResize={(d) => logsR.handleResize(-d)} />
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-app-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Execution Logs</span>
                  <button onClick={() => setLogs([])} className="text-xs text-app-text-muted hover:text-app-text">Clear</button>
                </div>
                <div className="overflow-auto flex-1 p-2 font-mono text-xs space-y-0.5">
                  {logs.length === 0 && <div className="text-app-text-muted/40 text-center mt-4">Run workflow to see logs</div>}
                  {logs.map((l, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-app-text-muted/40 shrink-0">{l.ts}</span>
                      <span className="text-app-text-muted/60 shrink-0 w-28 truncate">[{l.node}]</span>
                      <span className={logColor[l.type]}>{l.text}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Config panel */}
        <AnimatePresence>
          {showConfig && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: configR.size, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="bg-app-bg-secondary shrink-0 flex overflow-hidden">
              <ResizeHandle direction="horizontal" onResize={(d) => configR.handleResize(-d)} />
              <div className="flex-1 overflow-y-auto border-l border-app-border">
              <div className="p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-3">Node Config</div>
                {selectedNode ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Label</label>
                      <input value={selectedNode.label} onChange={(e) => updateLabel(e.target.value)} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1.5 text-xs text-app-text focus:outline-none focus:border-app-accent/40" />
                    </div>
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Type</label>
                      <div className={`px-2 py-1.5 rounded-md text-xs font-medium ${getNodeColor(selectedNode).bg} ${getNodeColor(selectedNode).text}`}>{selectedNode.type}</div>
                    </div>
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Configuration</label>
                      <div className="space-y-2">
                        {Object.entries(selectedNode.config).map(([key, val]) => (
                          <div key={key}>
                            <label className="text-[10px] text-app-text-muted capitalize">{key.replace(/_/g, " ")}</label>
                            <input value={val} onChange={(e) => updateConfig(key, e.target.value)} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Connections</label>
                      <div className="space-y-1">
                        {edges.filter((e) => e.from === selected || e.to === selected).map((e) => {
                          const other = e.from === selected ? e.to : e.from;
                          const otherNode = nodes.find((n) => n.id === other);
                          return (
                            <div key={`${e.from}-${e.to}`} className="flex items-center justify-between text-xs bg-app-bg rounded-md px-2 py-1.5 border border-app-border/50">
                              <span className="text-app-text-muted">{e.from === selected ? "→" : "←"} {otherNode?.label}</span>
                              <button onClick={() => deleteEdge(e.from, e.to)} className="text-red-400/60 hover:text-red-400 text-[10px]">Remove</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button onClick={() => deleteNode(selectedNode.id)} className="w-full text-xs text-red-400 border border-red-400/20 rounded-lg py-2 hover:bg-red-500/10 transition-colors">Delete Node</button>
                  </div>
                ) : (
                  <div className="text-xs text-app-text-muted text-center mt-8">Select a node to configure</div>
                )}
              </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
