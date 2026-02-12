"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

/* ─── Shared hook: drives step-based animation when element is in view ─── */
function useStepAnimation(totalSteps: number, intervalMs: number) {
  const [step, setStep] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (timerRef.current) return;
          setStep(0);
          timerRef.current = setInterval(() => {
            setStep((p) => (p + 1) % totalSteps);
          }, intervalMs);
        } else {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setStep(-1);
        }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSteps, intervalMs]);

  return { step, ref };
}

/* ━━━ 1. AI IDE MOCKUP ━━━ */
function AiIdeMockup() {
  const { step, ref } = useStepAnimation(18, 120);

  const codeLines = [
    { indent: 0, parts: [["keyword", "export default"], ["func", " async function"], ["name", " Dashboard"], ["plain", "() {"]] },
    { indent: 1, parts: [["keyword", "const"], ["plain", " users = "], ["keyword", "await"], ["name", " db"], ["plain", "."], ["func", "user"], ["plain", "."], ["func", "findMany"], ["plain", "()"]] },
    { indent: 1, parts: [["keyword", "const"], ["plain", " metrics = "], ["keyword", "await"], ["name", " analytics"], ["plain", "."], ["func", "getMetrics"], ["plain", "()"]] },
    { indent: 1, parts: [] },
    { indent: 1, parts: [["keyword", "return"], ["plain", " ("]] },
    { indent: 2, parts: [["tag", "<DashboardLayout>"]] },
    { indent: 3, parts: [["tag", "<StatsGrid data={metrics} />"]] },
    { indent: 3, parts: [["tag", "<UserTable users={users} />"]] },
    { indent: 2, parts: [["tag", "</DashboardLayout>"]] },
    { indent: 1, parts: [["plain", ")"]] },
    { indent: 0, parts: [["plain", "}"]] },
  ];

  const visibleLines = Math.min(codeLines.length, Math.max(0, step - 1));
  const showAI = step >= 13;
  const aiText = "Add pagination and search filtering to UserTable";
  const aiChars = showAI ? Math.min(aiText.length, (step - 13) * 10) : 0;

  const colorMap: Record<string, string> = {
    keyword: "text-purple-400",
    func: "text-amber-400",
    name: "text-cyan-300",
    tag: "text-zinc-400",
    plain: "text-zinc-200",
  };

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <div className="flex gap-1 ml-3">
          <span className="px-3 py-1 text-[10px] rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">page.tsx</span>
          <span className="px-3 py-1 text-[10px] rounded-md text-zinc-500">api/route.ts</span>
          <span className="px-3 py-1 text-[10px] rounded-md text-zinc-500">schema.prisma</span>
        </div>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">AI Active</span>
      </div>
      <div className="flex min-h-[300px]">
        <div className="w-10 border-r border-white/[0.04] pt-3 text-right pr-2">
          {codeLines.map((_, i) => (
            <div key={i} className={`text-[10px] leading-[22px] ${i < visibleLines ? "text-zinc-600" : "text-transparent"}`}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 p-3 font-mono text-[12px] leading-[22px]">
          {codeLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: i < visibleLines ? 1 : 0, x: i < visibleLines ? 0 : -10 }}
              transition={{ duration: 0.2 }}
              style={{ paddingLeft: `${line.indent * 20}px` }}
            >
              {line.parts.map(([type, text], j) => (
                <span key={j} className={colorMap[type] || "text-zinc-400"}>{text}</span>
              ))}
              {i === visibleLines - 1 && step < 13 && (
                <span className="inline-block w-[2px] h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-3 left-12 right-3 rounded-lg border border-indigo-500/30 bg-indigo-500/[0.07] backdrop-blur-sm p-3"
          >
            <div className="flex items-center gap-2 text-xs">
              <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold text-[9px]">AI</span>
              <span className="text-indigo-300">
                {aiText.slice(0, aiChars)}
                <span className="animate-pulse">|</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ━━━ 2. UI BUILDER MOCKUP ━━━ */
function UiBuilderMockup() {
  const { step, ref } = useStepAnimation(16, 120);

  const components = [
    { label: "Navbar", color: "#6366f1", placed: step >= 2 },
    { label: "Stats", color: "#22d3ee", placed: step >= 4 },
    { label: "Chart", color: "#a855f7", placed: step >= 6 },
    { label: "Table", color: "#f59e0b", placed: step >= 8 },
    { label: "Footer", color: "#10b981", placed: step >= 10 },
  ];
  const selectedIdx = step >= 12 ? 2 : step >= 10 ? 4 : step >= 8 ? 3 : step >= 6 ? 2 : step >= 4 ? 1 : step >= 2 ? 0 : -1;

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-zinc-500 ml-2">Visual UI Builder</span>
        <div className="ml-auto flex gap-1.5">
          {["Desktop", "Tablet", "Mobile"].map((m, i) => (
            <span key={m} className={`text-[9px] px-2 py-0.5 rounded ${i === 0 ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-zinc-600 border border-white/[0.04]"}`}>{m}</span>
          ))}
        </div>
      </div>
      <div className="flex min-h-[300px]">
        <div className="w-24 border-r border-white/[0.04] p-2 space-y-1.5">
          <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-2">Components</div>
          {components.map((c, i) => (
            <motion.div
              key={c.label}
              className={`px-2 py-1.5 rounded-md text-[10px] font-medium border transition-all ${c.placed ? "opacity-40" : "opacity-100"}`}
              style={{ borderColor: c.color + "30", background: c.color + "08", color: c.color }}
              animate={{ scale: step === i * 2 + 1 ? 0.9 : 1 }}
            >
              {c.label}
            </motion.div>
          ))}
        </div>
        <div className="flex-1 p-3 relative">
          <div className="w-full h-full rounded-lg border border-dashed border-white/[0.06] bg-white/[0.01] relative overflow-hidden" style={{ minHeight: 260 }}>
            {components.map((c, i) => {
              if (!c.placed) return null;
              const heights = [28, 56, 72, 60, 28];
              const tops = [0, 32, 92, 168, 232];
              const isSelected = i === selectedIdx;
              return (
                <motion.div
                  key={c.label}
                  className="absolute left-2 right-2 rounded-md border flex items-center justify-center"
                  style={{
                    top: tops[i],
                    height: heights[i],
                    borderColor: c.color + (isSelected ? "60" : "25"),
                    background: `linear-gradient(135deg, ${c.color}${isSelected ? "18" : "08"}, transparent)`,
                  }}
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <span className="text-[9px] font-bold" style={{ color: c.color }}>{c.label}</span>
                  {isSelected && (
                    <>
                      {["-top-1 -left-1", "-top-1 -right-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((pos) => (
                        <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full border-2 bg-[#0c0c14]`} style={{ borderColor: c.color }} />
                      ))}
                    </>
                  )}
                </motion.div>
              );
            })}
            {step >= 1 && step <= 11 && (
              <motion.div
                className="absolute w-3 h-3 z-20"
                animate={{
                  left: step % 2 === 1 ? 30 : "50%",
                  top: step % 2 === 1 ? 100 : Math.floor(step / 2) * 50,
                }}
                transition={{ type: "spring", stiffness: 150, damping: 15 }}
              >
                <svg width="12" height="16" viewBox="0 0 12 16" fill="none"><path d="M0 0l12 9-5 1-3 6L0 0z" fill="#818cf8" /></svg>
              </motion.div>
            )}
          </div>
        </div>
        <div className="w-36 border-l border-white/[0.04] p-3 space-y-3 hidden lg:block">
          <div className="text-[8px] uppercase tracking-wider text-zinc-600">Properties</div>
          {selectedIdx >= 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
              <div className="text-[10px] font-bold" style={{ color: components[selectedIdx]?.color }}>{components[selectedIdx]?.label}</div>
              {[["X", "8px"], ["Y", `${[0, 32, 92, 168, 232][selectedIdx]}px`], ["W", "100%"], ["H", `${[28, 56, 72, 60, 28][selectedIdx]}px`]].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-600">{k}</span>
                  <span className="text-[9px] text-zinc-400 font-mono bg-white/[0.03] px-1.5 py-0.5 rounded">{v}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-white/[0.04]">
                <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-1.5">Style</div>
                <div className="flex gap-1">
                  {["#6366f1", "#22d3ee", "#a855f7", "#10b981"].map((clr) => (
                    <div key={clr} className="w-4 h-4 rounded-full border border-white/10" style={{ background: clr }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ━━━ 3. WORKFLOW MOCKUP ━━━ */
function WorkflowMockup() {
  const { step, ref } = useStepAnimation(14, 120);

  const nodes = [
    { label: "Webhook Trigger", icon: "\u26A1", color: "#f59e0b", show: step >= 0 },
    { label: "Create User", icon: "\u2713", color: "#34d399", show: step >= 2 },
    { label: "Send Email", icon: "\u2709", color: "#60a5fa", show: step >= 4 },
    { label: "Notify Slack", icon: "#", color: "#a78bfa", show: step >= 4 },
    { label: "Start Trial", icon: "\u25B6", color: "#22d3ee", show: step >= 6 },
    { label: "Log Analytics", icon: "\uD83D\uDCCA", color: "#818cf8", show: step >= 8 },
  ];

  const pulseIdx = step >= 10 ? Math.floor((step - 10) % 4) : -1;

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-zinc-500 ml-2">Workflow &mdash; User Onboarding</span>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {step >= 10 ? "Running" : "Draft"}
        </span>
      </div>
      <div className="p-6 flex flex-col items-center min-h-[300px]">
        {nodes.map((node, i) => {
          if (!node.show) return null;
          const isPulsing = pulseIdx >= 0 && i <= pulseIdx + Math.floor((step - 10) * 1.5);

          if (i === 2) {
            return (
              <div key="branch" className="flex flex-col items-center w-full">
                <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="w-px h-5 bg-white/[0.08] origin-top" />
                <div className="flex gap-6 items-start">
                  {[nodes[2], nodes[3]].map((n, j) => (
                    <motion.div
                      key={n.label}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: j * 0.15, type: "spring", stiffness: 200, damping: 18 }}
                      className={`px-4 py-2 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${isPulsing ? "shadow-lg" : ""}`}
                      style={{
                        borderColor: n.color + "40",
                        background: n.color + (isPulsing ? "15" : "08"),
                        color: n.color,
                        boxShadow: isPulsing ? `0 0 20px ${n.color}20` : undefined,
                      }}
                    >
                      <span>{n.icon}</span>{n.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          }
          if (i === 3) return null;

          return (
            <div key={node.label} className="flex flex-col items-center">
              {i > 0 && <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="w-px h-5 bg-white/[0.08] origin-top" />}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className={`px-4 py-2.5 rounded-lg border text-[11px] font-medium flex items-center gap-2 ${isPulsing ? "shadow-lg" : ""}`}
                style={{
                  borderColor: node.color + "40",
                  background: node.color + (isPulsing ? "15" : "08"),
                  color: node.color,
                  boxShadow: isPulsing ? `0 0 20px ${node.color}20` : undefined,
                }}
              >
                <span className="text-sm">{node.icon}</span>{node.label}
              </motion.div>
            </div>
          );
        })}
        <AnimatePresence>
          {step >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              className="mt-5 w-full max-w-xs rounded-lg bg-white/[0.02] border border-white/[0.06] p-2.5"
            >
              <div className="text-[8px] uppercase tracking-wider text-zinc-600 mb-1.5">Execution Log</div>
              {nodes.slice(0, Math.min(nodes.length, step - 8)).map((n) => (
                <div key={n.label} className="flex items-center gap-2 py-0.5 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
                  <span className="text-zinc-500">{n.label}</span>
                  <span className="ml-auto text-[9px]" style={{ color: n.color }}>&#10003;</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ━━━ 4. CLOUD & HOSTING MOCKUP ━━━ */
function CloudMockup() {
  const { step, ref } = useStepAnimation(16, 120);

  const isDeploying = step >= 0 && step < 6;
  const isLive = step >= 6;
  const deployProgress = isDeploying ? Math.min(100, (step + 1) * 18) : 100;
  const deploySteps = [
    { label: "Building project...", done: step >= 1 },
    { label: "Running tests...", done: step >= 2 },
    { label: "Optimizing assets...", done: step >= 3 },
    { label: "Deploying to edge...", done: step >= 4 },
    { label: "SSL provisioning...", done: step >= 5 },
  ];

  const metrics = [
    { label: "CPU", value: isLive ? 23 : 0, max: 100, unit: "%", color: "#34d399" },
    { label: "Memory", value: isLive ? 512 : 0, max: 1024, unit: "MB", color: "#22d3ee" },
    { label: "Req/s", value: isLive ? 1247 : 0, max: 2000, unit: "", color: "#a78bfa" },
  ];

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-zinc-500 ml-2">Cloud &mdash; my-saas-app</span>
        <div className="ml-auto flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
          <span className={`text-[9px] ${isLive ? "text-emerald-400" : "text-amber-400"}`}>{isLive ? "Production" : "Deploying..."}</span>
        </div>
      </div>
      <div className="p-4 space-y-4 min-h-[300px]">
        {isDeploying && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-medium">Deployment v2.4.1</span>
              <span className="text-[10px] text-indigo-400 font-mono">{deployProgress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                animate={{ width: `${deployProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="space-y-1.5">
              {deploySteps.map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-[10px]"
                >
                  {s.done ? (
                    <span className="text-emerald-400 text-xs">&#10003;</span>
                  ) : (
                    <span className="w-3 h-3 border-2 border-zinc-700 border-t-indigo-400 rounded-full animate-spin" />
                  )}
                  <span className={s.done ? "text-zinc-500" : "text-zinc-300"}>{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
        {isLive && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-300">Live Metrics</span>
              <span className="text-[9px] text-zinc-600">us-east-1 &bull; 3 replicas</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {metrics.map((m) => (
                <div key={m.label} className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
                  <div className="text-[9px] text-zinc-600 mb-1">{m.label}</div>
                  <motion.div className="text-lg font-bold" style={{ color: m.color }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {m.value}{m.unit}
                  </motion.div>
                  <div className="mt-2 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: m.color }}
                      animate={{ width: `${(m.value / m.max) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-lg bg-white/[0.02] border border-white/[0.06] p-3">
              <div className="text-[9px] uppercase tracking-wider text-zinc-600 mb-2">Recent Deploys</div>
              {[
                { v: "v2.4.1", time: "2m ago" },
                { v: "v2.4.0", time: "1h ago" },
                { v: "v2.3.9", time: "3h ago" },
              ].map((d) => (
                <div key={d.v} className="flex items-center gap-2 py-1 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-zinc-400 font-mono">{d.v}</span>
                  <span className="text-zinc-600">{d.time}</span>
                  <span className="ml-auto text-emerald-400">&#10003;</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ━━━ 5. DATABASE MOCKUP ━━━ */
function DatabaseMockup() {
  const { step, ref } = useStepAnimation(18, 120);

  const tables = [
    { name: "users", cols: ["id uuid PK", "email varchar", "name varchar", "plan enum", "created_at timestamp"], color: "#818cf8", show: step >= 0 },
    { name: "projects", cols: ["id uuid PK", "user_id uuid FK", "name varchar", "status enum"], color: "#22d3ee", show: step >= 3 },
    { name: "subscriptions", cols: ["id uuid PK", "user_id uuid FK", "plan_id uuid FK", "active boolean"], color: "#a855f7", show: step >= 5 },
  ];

  const showRelations = step >= 7;
  const showQuery = step >= 10;
  const queryText = "Show all users who signed up this week with a pro plan";
  const queryChars = showQuery ? Math.min(queryText.length, (step - 10) * 8) : 0;
  const showResults = step >= 15;

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-zinc-500 ml-2">Database &mdash; Schema Editor</span>
        <div className="ml-auto flex gap-1.5">
          <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">main</span>
          <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">dev</span>
        </div>
      </div>
      <div className="p-4 space-y-3 min-h-[300px]">
        {tables.map((t) => {
          if (!t.show) return null;
          return (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="rounded-lg border overflow-hidden"
              style={{ borderColor: t.color + "25" }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: t.color + "15", background: t.color + "08" }}>
                <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                <span className="text-[11px] font-bold" style={{ color: t.color }}>{t.name}</span>
                <span className="text-[9px] text-zinc-600 ml-auto">{t.cols.length} cols</span>
              </div>
              <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
                {t.cols.map((col) => {
                  const [name, ...type] = col.split(" ");
                  return (
                    <div key={col} className="text-[10px] font-mono flex gap-2">
                      <span style={{ color: t.color }}>{name}</span>
                      <span className="text-zinc-600">{type.join(" ")}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {showRelations && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-4 py-1">
              {["users \u2192 projects", "users \u2192 subscriptions"].map((r) => (
                <span key={r} className="text-[9px] text-zinc-600 font-mono flex items-center gap-1.5">
                  <svg width="16" height="8" viewBox="0 0 16 8"><path d="M0 4h12m0 0l-3-3m3 3l-3 3" stroke="#818cf8" strokeWidth="1.2" fill="none" strokeLinecap="round" /></svg>
                  {r}
                </span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showQuery && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-indigo-500/25 bg-indigo-500/[0.06] p-3">
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white font-bold text-[9px]">AI</span>
                <span className="text-indigo-300">
                  {queryText.slice(0, queryChars)}
                  {queryChars < queryText.length && <span className="animate-pulse">|</span>}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="px-3 py-1.5 border-b border-white/[0.04] flex items-center gap-2">
                <span className="text-[9px] text-emerald-400">&#10003; 3 rows</span>
                <span className="text-[9px] text-zinc-600">12ms</span>
              </div>
              <div className="text-[10px] font-mono">
                <div className="flex border-b border-white/[0.04] bg-white/[0.02]">
                  {["email", "name", "plan", "created"].map((h) => (
                    <div key={h} className="flex-1 px-3 py-1.5 text-zinc-500 font-semibold">{h}</div>
                  ))}
                </div>
                {[
                  ["sara@...", "Sara", "pro", "2d ago"],
                  ["mike@...", "Mike", "pro", "4d ago"],
                  ["alex@...", "Alex", "pro", "6d ago"],
                ].map((row, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="flex border-b border-white/[0.02]">
                    {row.map((cell, j) => (
                      <div key={j} className="flex-1 px-3 py-1 text-zinc-400">{cell}</div>
                    ))}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ━━━ 6. DOMAINS MOCKUP ━━━ */
function DomainsMockup() {
  const { step, ref } = useStepAnimation(16, 120);

  const domains = [
    { name: "myapp.com", status: "Active", ssl: true, show: step >= 0 },
    { name: "api.myapp.com", status: "Active", ssl: true, show: step >= 3 },
    { name: "staging.myapp.com", status: step >= 8 ? "Active" : "Provisioning...", ssl: step >= 8, show: step >= 5 },
  ];

  const showDns = step >= 10;
  const dnsRecords = [
    { type: "A", name: "@", value: "76.76.21.21", color: "#818cf8" },
    { type: "CNAME", name: "www", value: "myapp.com", color: "#22d3ee" },
    { type: "MX", name: "mail", value: "mx.masidy.cloud", color: "#f59e0b" },
    { type: "TXT", name: "@", value: "v=spf1 include:masidy.cloud", color: "#34d399" },
  ];
  const visibleDns = showDns ? Math.min(dnsRecords.length, step - 9) : 0;

  return (
    <div ref={ref} className="relative w-full rounded-xl overflow-hidden bg-[#0c0c14] border border-white/[0.06] shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06] bg-[#111119]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] text-zinc-500 ml-2">Domain Manager</span>
        <span className="ml-auto text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{domains.filter((d) => d.show).length} domains</span>
      </div>
      <div className="p-4 space-y-3 min-h-[300px]">
        {domains.map((d) => {
          if (!d.show) return null;
          const isActive = d.status === "Active";
          return (
            <motion.div
              key={d.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <span className="text-[12px] font-medium text-zinc-200">{d.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {d.ssl && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    &#128274; SSL
                  </motion.span>
                )}
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"}`}>
                  {!isActive && <span className="inline-block w-2.5 h-2.5 border border-amber-400/60 border-t-amber-400 rounded-full animate-spin mr-1 align-middle" />}
                  {d.status}
                </span>
              </div>
            </motion.div>
          );
        })}

        <AnimatePresence>
          {showDns && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <div className="px-3 py-2 border-b border-white/[0.04]">
                <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-semibold">DNS Records</span>
              </div>
              <div className="divide-y divide-white/[0.03]">
                {dnsRecords.slice(0, visibleDns).map((r, i) => (
                  <motion.div
                    key={r.type + r.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-3 py-2 font-mono text-[10px]"
                  >
                    <span className="w-12 font-bold" style={{ color: r.color }}>{r.type}</span>
                    <span className="w-12 text-zinc-500">{r.name}</span>
                    <span className="text-zinc-400 flex-1">{r.value}</span>
                    <span className="text-emerald-400 text-[9px]">&#10003;</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ━━━ FEATURE DEFINITIONS ━━━ */
const features = [
  {
    label: "AI IDE",
    title: "Code with an AI co-pilot that understands your entire stack",
    description: "Monaco-powered editor with 6 AI engines \u2014 code generation, refactoring, bug fixing, explanation, and auto-completion. Like Cursor, but built into your platform.",
    bullets: [
      "AI code generation from natural language prompts",
      "Intelligent refactoring and bug detection",
      "Multi-file editing with full project context",
      "Built-in terminal, debugger, and Git integration",
    ],
    Mockup: AiIdeMockup,
  },
  {
    label: "VISUAL UI BUILDER",
    title: "Drag, drop, and ship \u2014 no code required",
    description: "Build production-ready UIs visually with a Retool-style drag-and-drop canvas. AI generates components from prompts, and you fine-tune with visual controls.",
    bullets: [
      "Drag-and-drop component library (100+ components)",
      "AI-powered layout generation from description",
      "Tailwind CSS styling with visual controls",
      "Real-time preview across desktop, tablet, mobile",
    ],
    Mockup: UiBuilderMockup,
  },
  {
    label: "WORKFLOW AUTOMATION",
    title: "Automate anything with visual AI workflows",
    description: "Build complex automation pipelines visually \u2014 like n8n, but with AI that generates entire workflows from a description. Connect APIs, databases, and services.",
    bullets: [
      "Visual node-based workflow builder",
      "AI auto-generates workflows from plain English",
      "200+ pre-built integrations (Slack, GitHub, Stripe...)",
      "Triggers: webhooks, cron, events, manual",
    ],
    Mockup: WorkflowMockup,
  },
  {
    label: "CLOUD & HOSTING",
    title: "Deploy anywhere \u2014 your cloud or ours",
    description: "Managed VPS hosting with one-click deploys, auto-scaling, SSL, and custom domains. Like Vercel, but you keep full control of your infrastructure.",
    bullets: [
      "One-click deploy from IDE or CI/CD",
      "Auto-scaling with built-in load balancing",
      "SSL certificates and DNS management",
      "Multi-region deploy (US, EU, APAC)",
    ],
    Mockup: CloudMockup,
  },
  {
    label: "DATABASE",
    title: "Managed databases with AI-powered schema design",
    description: "Postgres databases with visual schema builder, AI SQL assistant, branching for dev/staging/prod, automated backups, and row-level security. Like Supabase, built in.",
    bullets: [
      "AI SQL assistant \u2014 query in plain English",
      "Visual schema editor with migrations",
      "Database branching (dev, staging, production)",
      "Automated backups and point-in-time recovery",
    ],
    Mockup: DatabaseMockup,
  },
  {
    label: "DOMAINS & DNS",
    title: "Register, connect, and manage domains \u2014 all in one place",
    description: "Buy domains directly, configure DNS records, auto-provision SSL certificates, and connect to your deployed apps with zero configuration.",
    bullets: [
      "Domain registration and transfer",
      "Automatic SSL/TLS provisioning",
      "DNS record management (A, CNAME, MX, TXT)",
      "One-click connect to any hosted app",
    ],
    Mockup: DomainsMockup,
  },
];

/* ━━━ MAIN COMPONENT ━━━ */
export function FeatureShowcase() {
  return (
    <section id="platform" className="w-full max-w-7xl mx-auto py-24 px-4">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
          PLATFORM
        </span>
        <h2 className="text-4xl md:text-6xl font-extrabold text-app-text mb-5">
          Everything you need to ship
        </h2>
        <p className="text-app-text-secondary text-xl max-w-2xl mx-auto">
          Six core tools that replace your entire development stack &mdash; from writing code to deploying globally.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => {
          const MockupComponent = feature.Mockup;
          return (
            <motion.div
              key={feature.title}
              className="group rounded-2xl border border-app-border bg-app-card overflow-hidden hover:border-app-accent/30 transition-colors"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Mockup — always auto-running */}
              <div className="w-full h-[260px] overflow-hidden border-b border-app-border bg-[#0a0a12]">
                <MockupComponent />
              </div>
              {/* Info */}
              <div className="p-5">
                <span className="text-[10px] font-bold tracking-widest text-app-accent-text uppercase mb-1.5 block">
                  {feature.label}
                </span>
                <h3 className="text-lg font-bold text-app-text leading-snug mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-app-text-secondary leading-relaxed mb-3 line-clamp-2">
                  {feature.description}
                </p>
                <ul className="space-y-1.5">
                  {feature.bullets.slice(0, 3).map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                        <circle cx="12" cy="12" r="10" className="stroke-app-icon-primary" strokeWidth="1.5" />
                        <path d="M8 12l3 3 5-5" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="text-xs text-app-text-secondary">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
