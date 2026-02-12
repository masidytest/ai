"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResizeHandle, useResizable } from "./ui/ResizablePanel";

/* ─── types ─── */
interface ComponentItem {
  id: string;
  type: string;
  x: number;
  y: number;
  w: number;
  h: number;
  props: Record<string, string>;
}

const palette = [
  { type: "Button", icon: "M4 6h16M4 12h16M4 18h7", w: 120, h: 40, defaultProps: { label: "Button", variant: "primary" } },
  { type: "Card", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z", w: 240, h: 160, defaultProps: { title: "Card Title", text: "Card content goes here" } },
  { type: "Input", icon: "M4 6h16v12H4z", w: 200, h: 40, defaultProps: { placeholder: "Type here...", label: "Label" } },
  { type: "Image", icon: "M4 5h16v14H4zM4 5l5 5 3-3 8 8", w: 200, h: 140, defaultProps: { alt: "Placeholder", src: "" } },
  { type: "Text", icon: "M4 7V4h16v3M9 20h6M12 4v16", w: 200, h: 30, defaultProps: { content: "Text block", size: "16" } },
  { type: "Heading", icon: "M4 12h8M4 4v16M12 4v16M16 4h4v8h-4M16 12h4v8h-4", w: 240, h: 40, defaultProps: { content: "Heading", level: "h2" } },
  { type: "Divider", icon: "M3 12h18", w: 300, h: 4, defaultProps: {} },
  { type: "Badge", icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", w: 80, h: 28, defaultProps: { label: "Badge", color: "blue" } },
  { type: "Avatar", icon: "M12 12a5 5 0 100-10 5 5 0 000 10zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2", w: 48, h: 48, defaultProps: { initials: "AB" } },
  { type: "Table", icon: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18", w: 320, h: 180, defaultProps: { rows: "4", cols: "3" } },
];

const breakpoints = [
  { label: "Desktop", w: "100%", icon: "M4 5h16v10H4zM8 19h8" },
  { label: "Tablet", w: "768px", icon: "M6 3h12v18H6zM6 7h12M6 17h12" },
  { label: "Mobile", w: "375px", icon: "M8 2h8v20H8zM8 5h8M8 19h8" },
];

let nextId = 1;

/* ─── Render preview for each type ─── */
function ComponentPreview({ item, selected }: { item: ComponentItem; selected: boolean }) {
  const base = `absolute transition-shadow ${selected ? "ring-2 ring-app-accent shadow-lg shadow-app-accent/10" : "ring-1 ring-app-border/40 hover:ring-app-accent/30"}`;
  const style = { left: item.x, top: item.y, width: item.w, height: item.h };

  switch (item.type) {
    case "Button":
      return (
        <div className={base} style={style}>
          <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs font-semibold ${item.props.variant === "primary" ? "bg-app-accent/80 text-white" : item.props.variant === "outline" ? "border border-app-border text-app-text" : "bg-app-card text-app-text"}`}>
            {item.props.label}
          </div>
        </div>
      );
    case "Card":
      return (
        <div className={`${base} bg-app-card border border-app-border/50 rounded-xl p-3`} style={style}>
          <div className="text-xs font-semibold text-app-text mb-1">{item.props.title}</div>
          <div className="text-[10px] text-app-text-muted">{item.props.text}</div>
        </div>
      );
    case "Input":
      return (
        <div className={base} style={style}>
          <div className="w-full h-full rounded-lg bg-app-bg border border-app-border px-3 flex items-center text-xs text-app-text-muted">
            {item.props.placeholder}
          </div>
        </div>
      );
    case "Image":
      return (
        <div className={`${base} bg-app-card border border-app-border/50 rounded-lg flex items-center justify-center`} style={style}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-app-text-muted/30"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 16l5-5 4 4 4-4 5 5"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>
        </div>
      );
    case "Text":
      return (
        <div className={`${base} flex items-center text-app-text`} style={{ ...style, fontSize: `${item.props.size}px` }}>
          {item.props.content}
        </div>
      );
    case "Heading":
      return (
        <div className={`${base} flex items-center font-bold text-app-text text-lg`} style={style}>
          {item.props.content}
        </div>
      );
    case "Divider":
      return (
        <div className={`${base} flex items-center`} style={style}>
          <div className="w-full border-t border-app-border" />
        </div>
      );
    case "Badge":
      return (
        <div className={base} style={style}>
          <div className="w-full h-full rounded-full bg-app-accent/15 text-app-accent-text flex items-center justify-center text-[10px] font-bold">
            {item.props.label}
          </div>
        </div>
      );
    case "Avatar":
      return (
        <div className={base} style={style}>
          <div className="w-full h-full rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center text-xs font-bold text-app-accent-text">
            {item.props.initials}
          </div>
        </div>
      );
    case "Table":
      return (
        <div className={`${base} bg-app-card border border-app-border/50 rounded-lg overflow-hidden`} style={style}>
          <div className="w-full h-7 bg-app-bg-secondary border-b border-app-border/50 flex items-center px-2">
            {Array.from({ length: Number(item.props.cols) }, (_, i) => (
              <div key={i} className="flex-1 text-[9px] font-semibold text-app-text-muted px-1">Col {i + 1}</div>
            ))}
          </div>
          {Array.from({ length: Math.min(Number(item.props.rows), 4) }, (_, r) => (
            <div key={r} className="flex items-center px-2 h-6 border-b border-app-border/20 last:border-b-0">
              {Array.from({ length: Number(item.props.cols) }, (_, c) => (
                <div key={c} className="flex-1 text-[9px] text-app-text-muted px-1">Cell</div>
              ))}
            </div>
          ))}
        </div>
      );
    default:
      return <div className={`${base} bg-app-card border border-app-border/50 rounded-lg flex items-center justify-center text-xs text-app-text-muted`} style={style}>{item.type}</div>;
  }
}

export default function UiBuilder() {
  const [items, setItems] = useState<ComponentItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(true);
  const [showProps, setShowProps] = useState(true);
  const [bp, setBp] = useState(0);
  const [history, setHistory] = useState<ComponentItem[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [showCode, setShowCode] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const pushHistory = useCallback((newItems: ComponentItem[]) => {
    setHistory((prev) => [...prev.slice(0, historyIdx + 1), newItems]);
    setHistoryIdx((prev) => prev + 1);
  }, [historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setItems(history[historyIdx - 1]);
    }
  }, [history, historyIdx]);

  const redo = useCallback(() => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setItems(history[historyIdx + 1]);
    }
  }, [history, historyIdx]);

  const addComponent = useCallback((type: string) => {
    const p = palette.find((c) => c.type === type);
    if (!p) return;
    const id = `${type.toLowerCase()}_${nextId++}`;
    const newItem: ComponentItem = {
      id, type,
      x: 20 + (items.length % 4) * 30,
      y: 20 + Math.floor(items.length / 4) * 50,
      w: p.w, h: p.h,
      props: { ...p.defaultProps } as Record<string, string>,
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    setSelected(id);
    pushHistory(newItems);
  }, [items, pushHistory]);

  const updateProp = useCallback((key: string, value: string) => {
    if (!selected) return;
    const newItems = items.map((it) => it.id === selected ? { ...it, props: { ...it.props, [key]: value } } : it);
    setItems(newItems);
    pushHistory(newItems);
  }, [items, selected, pushHistory]);

  const updateSize = useCallback((dim: "w" | "h", value: number) => {
    if (!selected) return;
    const newItems = items.map((it) => it.id === selected ? { ...it, [dim]: Math.max(20, value) } : it);
    setItems(newItems);
    pushHistory(newItems);
  }, [items, selected, pushHistory]);

  const deleteSelected = useCallback(() => {
    if (!selected) return;
    const newItems = items.filter((it) => it.id !== selected);
    setItems(newItems);
    setSelected(null);
    pushHistory(newItems);
  }, [items, selected, pushHistory]);

  const duplicateSelected = useCallback(() => {
    const item = items.find((it) => it.id === selected);
    if (!item) return;
    const id = `${item.type.toLowerCase()}_${nextId++}`;
    const clone: ComponentItem = { ...item, id, x: item.x + 20, y: item.y + 20 };
    const newItems = [...items, clone];
    setItems(newItems);
    setSelected(id);
    pushHistory(newItems);
  }, [items, selected, pushHistory]);

  const selectedItem = items.find((it) => it.id === selected);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("component-type");
    if (!type) return;
    const p = palette.find((c) => c.type === type);
    if (!p || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round((e.clientX - rect.left - p.w / 2) / 10) * 10;
    const y = Math.round((e.clientY - rect.top - p.h / 2) / 10) * 10;
    const id = `${type.toLowerCase()}_${nextId++}`;
    const newItem: ComponentItem = { id, type, x: Math.max(0, x), y: Math.max(0, y), w: p.w, h: p.h, props: { ...p.defaultProps } as Record<string, string> };
    const newItems = [...items, newItem];
    setItems(newItems);
    setSelected(id);
    pushHistory(newItems);
  }, [items, pushHistory]);

  const handleCanvasItemDrag = useCallback((id: string, dx: number, dy: number) => {
    setItems((prev) => prev.map((it) =>
      it.id === id ? { ...it, x: Math.max(0, Math.round((it.x + dx) / 10) * 10), y: Math.max(0, Math.round((it.y + dy) / 10) * 10) } : it
    ));
  }, []);

  /* Generate JSX code */
  const generatedCode = items.map((it) => {
    switch (it.type) {
      case "Button": return `<button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">${it.props.label}</button>`;
      case "Card": return `<div className="p-4 rounded-xl border">\n  <h3>${it.props.title}</h3>\n  <p>${it.props.text}</p>\n</div>`;
      case "Input": return `<input placeholder="${it.props.placeholder}" className="px-3 py-2 border rounded-lg" />`;
      case "Text": return `<p style={{ fontSize: "${it.props.size}px" }}>${it.props.content}</p>`;
      case "Heading": return `<${it.props.level}>${it.props.content}</${it.props.level}>`;
      case "Image": return `<img src="${it.props.src}" alt="${it.props.alt}" className="rounded-lg" />`;
      case "Divider": return `<hr className="border-t border-gray-200" />`;
      case "Badge": return `<span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">${it.props.label}</span>`;
      case "Avatar": return `<div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold">${it.props.initials}</div>`;
      case "Table": return `<table className="w-full border">\n  <thead><tr>${Array.from({ length: Number(it.props.cols) }, (_, i) => `<th>Col ${i + 1}</th>`).join("")}</tr></thead>\n  <tbody>${Array.from({ length: Number(it.props.rows) }, () => `<tr>${Array.from({ length: Number(it.props.cols) }, () => `<td>Cell</td>`).join("")}</tr>`).join("\n  ")}</tbody>\n</table>`;
      default: return `{/* ${it.type} */}`;
    }
  }).join("\n\n");

  /* Resizable panels */
  const paletteR = useResizable({ initial: 190, min: 140, max: 320, storageKey: "ui-palette" });
  const codeR = useResizable({ initial: 200, min: 80, max: 400, storageKey: "ui-code" });
  const propsR = useResizable({ initial: 270, min: 200, max: 480, storageKey: "ui-props" });

  return (
    <div className="flex flex-col h-full bg-app-bg text-app-text overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-app-bg-secondary border-b border-app-border shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPalette(!showPalette)} className={`p-1.5 rounded-lg transition-colors ${showPalette ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="Components">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <div className="h-4 w-px bg-app-border mx-1" />
          <button onClick={undo} disabled={historyIdx <= 0} className="p-1.5 rounded-lg text-app-text-muted hover:text-app-text disabled:opacity-30 transition-colors" title="Undo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 10h13a4 4 0 010 8H8"/><path d="M3 10l4-4M3 10l4 4"/></svg>
          </button>
          <button onClick={redo} disabled={historyIdx >= history.length - 1} className="p-1.5 rounded-lg text-app-text-muted hover:text-app-text disabled:opacity-30 transition-colors" title="Redo">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10H8a4 4 0 000 8h9"/><path d="M21 10l-4-4M21 10l-4 4"/></svg>
          </button>
          <div className="h-4 w-px bg-app-border mx-1" />
          <button onClick={duplicateSelected} disabled={!selected} className="p-1.5 rounded-lg text-app-text-muted hover:text-app-text disabled:opacity-30 transition-colors text-xs" title="Duplicate">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
          <button onClick={deleteSelected} disabled={!selected} className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 disabled:opacity-30 transition-colors" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Breakpoint switcher */}
          <div className="flex items-center bg-app-card rounded-lg border border-app-border overflow-hidden">
            {breakpoints.map((b, i) => (
              <button key={b.label} onClick={() => setBp(i)} className={`p-1.5 transition-colors ${bp === i ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title={b.label}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d={b.icon}/></svg>
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-app-border mx-1" />
          <button onClick={() => setShowCode(!showCode)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${showCode ? "bg-app-accent/15 text-app-accent-text" : "bg-app-card border border-app-border text-app-text-muted hover:text-app-text"}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            Code
          </button>
          <button onClick={() => setShowProps(!showProps)} className={`p-1.5 rounded-lg transition-colors ${showProps ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`} title="Properties">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <span className="text-xs text-app-text-muted">{items.length} items</span>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Palette — resizable */}
        <AnimatePresence>
          {showPalette && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: paletteR.size, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-app-bg-secondary shrink-0 flex overflow-hidden"
            >
              <div className="flex-1 overflow-y-auto border-r border-app-border">
              <div className="p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-3">Components</div>
                <div className="space-y-1">
                  {palette.map((c) => (
                    <div
                      key={c.type}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("component-type", c.type)}
                      onClick={() => addComponent(c.type)}
                      className="flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-grab hover:bg-app-card active:cursor-grabbing transition-colors group"
                    >
                      <div className="w-7 h-7 rounded-md bg-app-accent/10 flex items-center justify-center shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={c.icon}/></svg>
                      </div>
                      <span className="text-xs text-app-text-secondary group-hover:text-app-text">{c.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              </div>
              <ResizeHandle direction="horizontal" onResize={paletteR.handleResize} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Code panel */}
          <AnimatePresence>
            {showCode && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: codeR.size }}
                exit={{ height: 0 }}
                transition={{ duration: 0.2 }}
                className="border-b border-app-border bg-app-bg-secondary shrink-0 overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-app-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted">Generated JSX</span>
                  <button onClick={() => navigator.clipboard?.writeText(generatedCode)} className="text-[10px] text-app-accent-text hover:underline">Copy</button>
                </div>
                <pre className="p-3 text-xs font-mono text-app-text-secondary overflow-auto flex-1 whitespace-pre-wrap">{generatedCode || "// Add components to see generated code"}</pre>
                <ResizeHandle direction="vertical" onResize={codeR.handleResize} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Canvas */}
          <div className="flex-1 overflow-auto bg-app-bg p-4 flex justify-center">
            <div
              ref={canvasRef}
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
              className="relative bg-app-bg-secondary border border-app-border/50 rounded-xl overflow-hidden"
              style={{
                width: breakpoints[bp].w,
                maxWidth: "100%",
                minHeight: 500,
                backgroundImage:
                  "radial-gradient(circle, var(--app-border) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            >
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  drag
                  dragMomentum={false}
                  onDrag={(_, info) => handleCanvasItemDrag(item.id, info.delta.x, info.delta.y)}
                  onClick={(e) => { e.stopPropagation(); setSelected(item.id); }}
                  style={{ position: "absolute", left: 0, top: 0, cursor: "move" }}
                >
                  <ComponentPreview item={item} selected={selected === item.id} />
                </motion.div>
              ))}
              {items.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-app-text-muted/40">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                  <p className="text-sm mt-3">Drag components here or click to add</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Properties panel — resizable */}
        <AnimatePresence>
          {showProps && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: propsR.size, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-app-bg-secondary shrink-0 flex overflow-hidden"
            >
              <ResizeHandle direction="horizontal" onResize={(d) => propsR.handleResize(-d)} />
              <div className="flex-1 overflow-y-auto border-l border-app-border">
              <div className="p-3">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-3">Properties</div>
                {selectedItem ? (
                  <div className="space-y-4">
                    <div>
                      <div className="text-xs font-semibold text-app-text mb-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-app-accent/10 text-app-accent-text text-[10px]">{selectedItem.type}</span>
                        <span className="text-app-text-muted font-normal">{selectedItem.id}</span>
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Size</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-app-text-muted">W</label>
                          <input type="number" value={selectedItem.w} onChange={(e) => updateSize("w", Number(e.target.value))} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40" />
                        </div>
                        <div>
                          <label className="text-[10px] text-app-text-muted">H</label>
                          <input type="number" value={selectedItem.h} onChange={(e) => updateSize("h", Number(e.target.value))} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40" />
                        </div>
                      </div>
                    </div>

                    {/* Position */}
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-app-text-muted">X</label>
                          <input type="number" value={selectedItem.x} readOnly className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text-muted" />
                        </div>
                        <div>
                          <label className="text-[10px] text-app-text-muted">Y</label>
                          <input type="number" value={selectedItem.y} readOnly className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text-muted" />
                        </div>
                      </div>
                    </div>

                    {/* Props */}
                    {Object.entries(selectedItem.props).length > 0 && (
                      <div>
                        <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Props</label>
                        <div className="space-y-2">
                          {Object.entries(selectedItem.props).map(([key, val]) => (
                            <div key={key}>
                              <label className="text-[10px] text-app-text-muted capitalize">{key}</label>
                              {key === "variant" ? (
                                <select value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40">
                                  <option value="primary">Primary</option>
                                  <option value="outline">Outline</option>
                                  <option value="ghost">Ghost</option>
                                </select>
                              ) : key === "level" ? (
                                <select value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40">
                                  <option value="h1">H1</option>
                                  <option value="h2">H2</option>
                                  <option value="h3">H3</option>
                                </select>
                              ) : (
                                <input type={key === "rows" || key === "cols" || key === "size" ? "number" : "text"} value={val} onChange={(e) => updateProp(key, e.target.value)} className="w-full bg-app-bg border border-app-border rounded-md px-2 py-1 text-xs text-app-text focus:outline-none focus:border-app-accent/40" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Layers */}
                    <div>
                      <label className="text-[10px] text-app-text-muted uppercase tracking-wider mb-1 block">Layers ({items.length})</label>
                      <div className="space-y-0.5 max-h-40 overflow-auto">
                        {items.map((it) => (
                          <button
                            key={it.id}
                            onClick={() => setSelected(it.id)}
                            className={`w-full text-left text-[11px] px-2 py-1.5 rounded-md transition-colors flex items-center justify-between ${
                              selected === it.id ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text hover:bg-app-card"
                            }`}
                          >
                            <span>{it.type}</span>
                            <span className="text-[9px] text-app-text-muted">{it.id}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-app-text-muted text-center mt-8">Select a component to edit properties</div>
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
