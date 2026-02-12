"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ─── 6 Feature Tabs ─── */
const TABS = [
  { id: "code", label: "AI Code", icon: "\u2728", color: "#818cf8" },
  { id: "ui", label: "UI Builder", icon: "\u25A8", color: "#a855f7" },
  { id: "workflow", label: "Workflows", icon: "\u26A1", color: "#f59e0b" },
  { id: "deploy", label: "Deploy", icon: "\uD83D\uDE80", color: "#10b981" },
  { id: "db", label: "Database", icon: "\uD83D\uDDC4\uFE0F", color: "#22d3ee" },
  { id: "domain", label: "Domains", icon: "\uD83C\uDF10", color: "#6366f1" },
];

/* ─── CODE TAB DATA ─── */
const CODE_LINES = [
  { text: "import { auth } from '@/lib/auth';", c: "text-purple-400" },
  { text: "import { prisma } from '@/lib/db';", c: "text-purple-400" },
  { text: "", c: "" },
  { text: "export default async function Dashboard() {", c: "text-yellow-300" },
  { text: "  const session = await auth();", c: "" },
  { text: "  const metrics = await prisma.metric.findMany({", c: "" },
  { text: "    where: { teamId: session.teamId },", c: "text-emerald-400" },
  { text: "  });", c: "" },
  { text: "  return (", c: "text-yellow-300" },
  { text: "    <DashboardShell>", c: "text-blue-400" },
  { text: "      <KpiRow data={metrics} />", c: "text-blue-400" },
  { text: "      <AnalyticsChart data={metrics} />", c: "text-blue-400" },
  { text: "    </DashboardShell>", c: "text-blue-400" },
  { text: "  );", c: "text-yellow-300" },
  { text: "}", c: "text-yellow-300" },
];

const FILES = ["src/", "  app/", "    page.tsx", "    dashboard/", "      page.tsx", "  api/", "    auth.ts", "    billing.ts", "  components/", "    Navbar.tsx", "    Chart.tsx", "  prisma/", "    schema.prisma"];

/* ─── UI BUILDER TAB DATA ─── */
const UI_WIDGETS = [
  { label: "Navbar", color: "#6366f1", top: 0, h: 24 },
  { label: "Sidebar", color: "#8b5cf6", top: 28, h: 212 },
  { label: "Stats", color: "#22d3ee", top: 28, h: 48, left: 72 },
  { label: "Chart", color: "#a855f7", top: 80, h: 80, left: 72 },
  { label: "Table", color: "#f59e0b", top: 164, h: 76, left: 72 },
];

/* ─── WORKFLOW TAB DATA ─── */
const WF_NODES = [
  { label: "Webhook", color: "#f59e0b" },
  { label: "Create User", color: "#34d399" },
  { label: "Send Email", color: "#60a5fa" },
  { label: "Notify Slack", color: "#a78bfa" },
  { label: "Start Trial", color: "#22d3ee" },
  { label: "Analytics", color: "#818cf8" },
];

/* ─── DEPLOY TAB DATA ─── */
const DEPLOY_STEPS = [
  "Installing dependencies...",
  "Building production bundle...",
  "Provisioning database...",
  "Deploying to 12 edge regions...",
  "SSL + health checks...",
  "Live \u2192 masidy.app/dashboard",
];

/* ─── DB TAB DATA ─── */
const DB_TABLES = [
  { name: "users", cols: ["id uuid PK", "email varchar", "name varchar", "plan enum"], color: "#818cf8" },
  { name: "projects", cols: ["id uuid PK", "user_id FK", "name varchar"], color: "#22d3ee" },
  { name: "subs", cols: ["id uuid PK", "user_id FK", "active bool"], color: "#a855f7" },
];

/* ─── DOMAIN TAB DATA ─── */
const DOMAINS = [
  { name: "myapp.com", ssl: true, active: true },
  { name: "api.myapp.com", ssl: true, active: true },
  { name: "staging.myapp.com", ssl: false, active: false },
];
const DNS = [
  { type: "A", rec: "@", val: "76.76.21.21", color: "#818cf8" },
  { type: "CNAME", rec: "www", val: "myapp.com", color: "#22d3ee" },
  { type: "MX", rec: "mail", val: "mx.masidy.cloud", color: "#f59e0b" },
];

/* ━━━ MAIN COMPONENT ━━━ */
export function DemoSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [step, setStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inView = useRef(false);
  const activeTabRef = useRef(0);
  const stepRef = useRef(0);

  /* Step animation per tab */
  const maxStepsMap = [15, 10, 12, 12, 14, 10];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tick = () => {
      stepRef.current += 1;
      if (stepRef.current >= maxStepsMap[activeTabRef.current]) {
        // Advance to next tab
        const nextTab = (activeTabRef.current + 1) % TABS.length;
        activeTabRef.current = nextTab;
        stepRef.current = 0;
        setActiveTab(nextTab);
        setStep(0);
      } else {
        setStep(stepRef.current);
      }
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        if (e.isIntersecting && !timerRef.current) {
          stepRef.current = 0;
          setStep(0);
          timerRef.current = setInterval(tick, 150);
        }
        if (!e.isIntersecting && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  /* Reset step on manual tab change */
  const switchTab = (idx: number) => {
    activeTabRef.current = idx;
    stepRef.current = 0;
    setActiveTab(idx);
    setStep(0);
  };

  const tab = TABS[activeTab];

  return (
    <section ref={sectionRef} className="w-full py-24 bg-app-bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">PLATFORM SHOWCASE</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-app-text mb-5">Everything in one platform</h2>
          <p className="text-app-text-secondary text-xl max-w-2xl mx-auto">Six powerful tools working together &mdash; code, design, automate, deploy, store, and connect.</p>
        </motion.div>

        <motion.div className="rounded-2xl border border-app-border bg-app-card shadow-2xl overflow-hidden" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          {/* Tab bar */}
          <div className="flex items-center gap-1 px-4 py-2.5 border-b border-app-border bg-app-surface/80 overflow-x-auto">
            <div className="flex gap-1.5 mr-3">
              <div className="w-3 h-3 rounded-full bg-red-400/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
              <div className="w-3 h-3 rounded-full bg-green-400/80" />
            </div>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => switchTab(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap ${
                  i === activeTab
                    ? "bg-white/[0.08] text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]"
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {i === activeTab && (
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: t.color }}
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                )}
              </button>
            ))}
            {/* Auto-cycle progress */}
            <div className="ml-auto hidden sm:flex items-center gap-2">
              <div className="w-20 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: tab.color }}
                  animate={{ width: `${Math.min(100, (step / maxStepsMap[activeTab]) * 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[9px] text-zinc-600">{activeTab + 1}/6</span>
            </div>
          </div>

          {/* Content area */}
          <div className="min-h-[440px] relative">
            <AnimatePresence mode="wait">
              {activeTab === 0 && <CodeTab key="code" step={step} />}
              {activeTab === 1 && <UiTab key="ui" step={step} />}
              {activeTab === 2 && <WorkflowTab key="wf" step={step} />}
              {activeTab === 3 && <DeployTab key="dep" step={step} />}
              {activeTab === 4 && <DbTab key="db" step={step} />}
              {activeTab === 5 && <DomainTab key="dom" step={step} />}
            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-1.5 border-t border-app-border bg-app-surface/50 text-[10px] text-app-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: tab.color }} />
              <span>{tab.label}</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span>TypeScript</span><span>Next.js 15</span><span>Tailwind v4</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ━━━ TAB: AI CODE ━━━ */
function CodeTab({ step }: { step: number }) {
  const visibleFiles = Math.min(FILES.length, step);
  const visibleCode = Math.min(CODE_LINES.length, Math.max(0, step - 2));
  const showAI = step >= 12;

  return (
    <motion.div className="flex h-[440px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* File tree */}
      <div className="w-44 border-r border-app-border p-3 overflow-hidden flex-shrink-0">
        <div className="text-[9px] font-bold uppercase tracking-wider text-app-text-muted mb-2">Explorer</div>
        {FILES.slice(0, visibleFiles).map((f, i) => {
          const indent = f.search(/\S/);
          const name = f.trim();
          const isDir = name.endsWith("/");
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 py-[2px]" style={{ paddingLeft: indent * 4 }}>
              {isDir ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" opacity={0.7}><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" /></svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity={0.6}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
              )}
              <span className={`text-[10px] ${isDir ? "font-semibold text-zinc-300" : "text-zinc-500"}`}>{name}</span>
            </motion.div>
          );
        })}
      </div>
      {/* Code editor */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-app-border bg-app-surface/50">
          <span className="px-2.5 py-0.5 text-[10px] rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">dashboard/page.tsx</span>
          <span className="px-2.5 py-0.5 text-[10px] rounded text-zinc-600">schema.prisma</span>
        </div>
        <div className="flex-1 p-4 font-mono text-[12px] leading-[20px] overflow-hidden">
          {CODE_LINES.slice(0, visibleCode).map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
              <span className="w-6 text-right pr-3 text-zinc-700 select-none text-[10px]">{i + 1}</span>
              <span className={line.c || "text-zinc-400"}>{line.text || "\u00A0"}</span>
            </motion.div>
          ))}
          {visibleCode < CODE_LINES.length && (
            <div className="flex items-center">
              <span className="w-6 text-right pr-3 text-zinc-700 text-[10px]">{visibleCode + 1}</span>
              <span className="inline-block w-[2px] h-4 bg-indigo-500 animate-pulse" />
            </div>
          )}
        </div>
        <AnimatePresence>
          {showAI && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-3 left-3 right-3 rounded-lg border border-indigo-500/30 bg-indigo-500/[0.07] backdrop-blur-sm p-2.5">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold text-[9px]">AI</span>
                <span className="text-indigo-300">Add pagination and search filtering to Dashboard<span className="animate-pulse">|</span></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ━━━ TAB: UI BUILDER ━━━ */
function UiTab({ step }: { step: number }) {
  const placed = Math.min(UI_WIDGETS.length, step);
  const selected = placed > 0 ? Math.min(placed - 1, step >= 8 ? 3 : step >= 5 ? 2 : step >= 3 ? 1 : 0) : -1;

  return (
    <motion.div className="flex h-[440px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Palette */}
      <div className="w-28 border-r border-app-border p-3 space-y-1.5">
        <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-2">Components</div>
        {UI_WIDGETS.map((w, i) => (
          <motion.div
            key={w.label}
            className={`px-2 py-1.5 rounded-md text-[10px] font-medium border ${i < placed ? "opacity-40" : ""}`}
            style={{ borderColor: w.color + "30", background: w.color + "08", color: w.color }}
            animate={{ scale: step === i ? 0.9 : 1 }}
          >
            {w.label}
          </motion.div>
        ))}
      </div>
      {/* Canvas */}
      <div className="flex-1 p-4 relative">
        <div className="w-full h-full rounded-lg border border-dashed border-white/[0.06] bg-white/[0.01] relative" style={{ minHeight: 380 }}>
          {UI_WIDGETS.slice(0, placed).map((w, i) => {
            const isSelected = i === selected;
            const isFull = !w.left;
            return (
              <motion.div
                key={w.label}
                className="absolute rounded-md border flex items-center justify-center"
                style={{
                  top: w.top,
                  left: w.left || 0,
                  width: isFull ? "100%" : "calc(100% - 72px)",
                  height: w.h,
                  borderColor: w.color + (isSelected ? "60" : "25"),
                  background: `linear-gradient(135deg, ${w.color}${isSelected ? "18" : "08"}, transparent)`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
              >
                <span className="text-[9px] font-bold" style={{ color: w.color }}>{w.label}</span>
                {isSelected && ["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full border-2 bg-[#0c0c14]`} style={{ borderColor: w.color }} />
                ))}
              </motion.div>
            );
          })}
          {step >= 1 && step <= 6 && (
            <motion.div className="absolute w-3 h-3 z-20" animate={{ left: step % 2 === 0 ? 20 : "50%", top: step * 35 }} transition={{ type: "spring", stiffness: 150, damping: 15 }}>
              <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><path d="M0 0l12 9-5 1-3 6L0 0z" fill="#818cf8" /></svg>
            </motion.div>
          )}
        </div>
      </div>
      {/* Props */}
      <div className="w-32 border-l border-app-border p-3 hidden lg:block">
        <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-2">Properties</div>
        {selected >= 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
            <div className="text-[10px] font-bold" style={{ color: UI_WIDGETS[selected]?.color }}>{UI_WIDGETS[selected]?.label}</div>
            {[["X", `${UI_WIDGETS[selected]?.left || 0}px`], ["Y", `${UI_WIDGETS[selected]?.top}px`], ["H", `${UI_WIDGETS[selected]?.h}px`]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[9px]">
                <span className="text-zinc-600">{k}</span>
                <span className="text-zinc-400 font-mono bg-white/[0.03] px-1 rounded">{v}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/[0.04]">
              <div className="flex gap-1 mt-1">
                {["#6366f1", "#22d3ee", "#a855f7", "#10b981"].map((c) => (
                  <div key={c} className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: c }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/* ━━━ TAB: WORKFLOWS ━━━ */
function WorkflowTab({ step }: { step: number }) {
  const visible = Math.min(WF_NODES.length, step);
  const running = step >= 8;

  return (
    <motion.div className="h-[440px] p-6 flex flex-col items-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex flex-col items-center flex-1">
        {WF_NODES.slice(0, visible).map((n, i) => {
          const isPulsing = running && i <= step - 8;
          if (i === 2 && visible >= 4) {
            return (
              <div key="branch" className="flex flex-col items-center">
                <div className="w-px h-4 bg-white/[0.08]" />
                <div className="flex gap-5">
                  {[WF_NODES[2], WF_NODES[3]].map((nd, j) => (
                    <motion.div key={nd.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: j * 0.1 }}
                      className="px-3 py-2 rounded-lg border text-[11px] font-medium flex items-center gap-1.5"
                      style={{ borderColor: nd.color + "40", background: nd.color + (isPulsing ? "15" : "08"), color: nd.color, boxShadow: isPulsing ? `0 0 15px ${nd.color}20` : undefined }}>
                      {nd.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          }
          if (i === 3) return null;
          return (
            <div key={n.label} className="flex flex-col items-center">
              {i > 0 && i !== 4 && <div className="w-px h-4 bg-white/[0.08]" />}
              {i === 4 && <div className="w-px h-4 bg-white/[0.08]" />}
              <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                className="px-4 py-2 rounded-lg border text-[11px] font-medium flex items-center gap-1.5"
                style={{ borderColor: n.color + "40", background: n.color + (isPulsing ? "15" : "08"), color: n.color, boxShadow: isPulsing ? `0 0 15px ${n.color}20` : undefined }}>
                {n.label}
              </motion.div>
            </div>
          );
        })}
      </div>
      {running && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xs rounded-lg bg-white/[0.02] border border-white/[0.06] p-2.5 mt-2">
          <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-1">Execution Log</div>
          {WF_NODES.slice(0, Math.min(WF_NODES.length, step - 7)).map((n) => (
            <div key={n.label} className="flex items-center gap-2 py-0.5 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
              <span className="text-zinc-500">{n.label}</span>
              <span className="ml-auto text-[9px]" style={{ color: n.color }}>&#10003;</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ━━━ TAB: DEPLOY ━━━ */
function DeployTab({ step }: { step: number }) {
  const done = Math.min(DEPLOY_STEPS.length, step);
  const isLive = done >= DEPLOY_STEPS.length;
  const progress = Math.min(100, (done / DEPLOY_STEPS.length) * 100);

  return (
    <motion.div className="h-[440px] p-5 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Terminal</span>
        <span className="text-[10px] text-zinc-600 font-mono">$ masidy deploy --production</span>
        <div className="ml-auto flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
          <span className={`text-[9px] ${isLive ? "text-emerald-400" : "text-amber-400"}`}>{isLive ? "Live" : "Deploying..."}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] mb-4 overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
      </div>
      <div className="font-mono text-[12px] space-y-2 flex-1">
        {DEPLOY_STEPS.slice(0, done).map((s, i) => {
          const isLast = i === DEPLOY_STEPS.length - 1;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 ${isLast && isLive ? "text-emerald-400 font-bold mt-2" : "text-zinc-400"}`}>
              {i < done - 1 || isLive ? <span className="text-emerald-400">&#10003;</span> : <span className="w-3 h-3 border-2 border-zinc-700 border-t-indigo-400 rounded-full animate-spin" />}
              {s}
            </motion.div>
          );
        })}
      </div>
      {isLive && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-4 gap-2 mt-3">
          {[
            { label: "Regions", value: "12", icon: "\uD83C\uDF0D" },
            { label: "Database", value: "Postgres", icon: "\uD83D\uDDC4\uFE0F" },
            { label: "SSL", value: "Active", icon: "\uD83D\uDD12" },
            { label: "CDN", value: "Global", icon: "\u26A1" },
          ].map((c) => (
            <div key={c.label} className="rounded-lg border border-app-border bg-app-surface/50 p-2 text-center">
              <span className="text-sm block">{c.icon}</span>
              <span className="text-[8px] text-zinc-600 uppercase">{c.label}</span>
              <span className="text-[10px] font-bold text-zinc-300 block">{c.value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ━━━ TAB: DATABASE ━━━ */
function DbTab({ step }: { step: number }) {
  const visibleTables = Math.min(DB_TABLES.length, Math.floor(step / 2));
  const showQuery = step >= 8;
  const showResults = step >= 11;
  const queryText = "Show users who signed up this week with pro plan";
  const qChars = showQuery ? Math.min(queryText.length, (step - 8) * 12) : 0;

  return (
    <motion.div className="h-[440px] p-5 space-y-3 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {DB_TABLES.slice(0, visibleTables).map((t) => (
        <motion.div key={t.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border overflow-hidden" style={{ borderColor: t.color + "25" }}>
          <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ borderColor: t.color + "15", background: t.color + "08" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
            <span className="text-[11px] font-bold" style={{ color: t.color }}>{t.name}</span>
            <span className="text-[9px] text-zinc-600 ml-auto">{t.cols.length} cols</span>
          </div>
          <div className="px-3 py-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
            {t.cols.map((col) => {
              const [name, ...rest] = col.split(" ");
              return <div key={col} className="text-[10px] font-mono flex gap-1"><span style={{ color: t.color }}>{name}</span><span className="text-zinc-600">{rest.join(" ")}</span></div>;
            })}
          </div>
        </motion.div>
      ))}
      {step >= 6 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-3 py-1 text-[9px] text-zinc-600 font-mono">
          {["users \u2192 projects", "users \u2192 subs"].map((r) => <span key={r}>{r}</span>)}
        </motion.div>
      )}
      <AnimatePresence>
        {showQuery && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-indigo-500/25 bg-indigo-500/[0.06] p-2.5 flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold text-[9px]">AI</span>
            <span className="text-[11px] text-indigo-300">{queryText.slice(0, qChars)}{qChars < queryText.length && <span className="animate-pulse">|</span>}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="px-3 py-1 border-b border-white/[0.04] flex gap-2">
              <span className="text-[9px] text-emerald-400">&#10003; 3 rows</span><span className="text-[9px] text-zinc-600">8ms</span>
            </div>
            <div className="text-[10px] font-mono">
              {[["sara@...", "Sara", "pro"], ["mike@...", "Mike", "pro"], ["alex@...", "Alex", "pro"]].map((row, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }} className="flex border-b border-white/[0.02]">
                  {row.map((c, j) => <div key={j} className="flex-1 px-3 py-1 text-zinc-400">{c}</div>)}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ━━━ TAB: DOMAINS ━━━ */
function DomainTab({ step }: { step: number }) {
  const visibleDomains = Math.min(DOMAINS.length, Math.floor(step / 2) + 1);
  const showDns = step >= 6;
  const visibleDns = showDns ? Math.min(DNS.length, step - 5) : 0;

  return (
    <motion.div className="h-[440px] p-5 space-y-3 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {DOMAINS.slice(0, visibleDomains).map((d, i) => {
        const isActive = d.active || (i === 2 && step >= 5);
        const hasSsl = d.ssl || (i === 2 && step >= 5);
        return (
          <motion.div key={d.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
              <span className="text-[12px] font-medium text-zinc-200">{d.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {hasSsl && <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">SSL</span>}
              <span className={`text-[9px] px-2 py-0.5 rounded-full border ${isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                {isActive ? "Active" : "Provisioning..."}
              </span>
            </div>
          </motion.div>
        );
      })}
      <AnimatePresence>
        {showDns && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
            <div className="px-3 py-2 border-b border-white/[0.04]">
              <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-semibold">DNS Records</span>
            </div>
            {DNS.slice(0, visibleDns).map((r) => (
              <motion.div key={r.type} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 px-3 py-2 font-mono text-[10px]">
                <span className="w-12 font-bold" style={{ color: r.color }}>{r.type}</span>
                <span className="w-10 text-zinc-500">{r.rec}</span>
                <span className="text-zinc-400 flex-1">{r.val}</span>
                <span className="text-emerald-400 text-[9px]">&#10003;</span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
