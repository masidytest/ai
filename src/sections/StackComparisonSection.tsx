"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/* ── Premium SVG icons ── */
function ToolIcon({ d, color }: { d: string; color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const oldStack: { name: string; price: number; category: string; icon: ReactNode }[] = [
  { name: "Cursor / VS Code", price: 20, category: "AI IDE", icon: <ToolIcon d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" color="#ef4444" /> },
  { name: "Vercel", price: 20, category: "Hosting", icon: <ToolIcon d="M12 2L2 19.5h20L12 2z" color="#ef4444" /> },
  { name: "Supabase", price: 25, category: "Database", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
  { name: "n8n / Zapier", price: 30, category: "Workflows", icon: <ToolIcon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" color="#ef4444" /> },
  { name: "Cloudflare", price: 20, category: "Domains & CDN", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
  { name: "Retool / Builder", price: 50, category: "UI Builder", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
];

const masidyFeatures: { name: string; icon: ReactNode }[] = [
  { name: "AI IDE", icon: <ToolIcon d="M16 18l6-6-6-6M8 6l-6 6 6 6" color="var(--app-accent)" /> },
  { name: "Visual UI Builder", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
  { name: "Workflow Automation", icon: <ToolIcon d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" color="var(--app-accent)" /> },
  { name: "Cloud Hosting", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg> },
  { name: "Managed Database", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg> },
  { name: "Domains & DNS", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
];

const totalOld = 165;

function useCountUp(target: number, duration: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame: number;
    const t0 = performance.now();
    const tick = (now: number) => {
      const elapsed = now - t0;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, start]);
  return value;
}

export function StackComparisonSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const savings = useCountUp(totalOld - 49, 2200, inView);
  const oldTotal = useCountUp(totalOld, 2000, inView);

  return (
    <section ref={sectionRef} className="w-full py-28 bg-app-bg overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
            WHY SWITCH
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-app-text mb-5">
            Replace your entire stack
          </h2>
          <p className="text-app-text-secondary text-xl max-w-2xl mx-auto">
            Stop juggling 6 subscriptions, 6 dashboards, and 6 billing cycles. One platform does it all.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Old stack */}
          <motion.div
            className="rounded-2xl border border-red-500/20 bg-app-card shadow-sm p-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </div>
              <h3 className="text-xl font-bold text-app-text">Before Masidy</h3>
            </div>
            <div className="space-y-2.5">
              {oldStack.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-red-500/5 border border-red-500/10"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.08 * i }}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0 opacity-60">{tool.icon}</span>
                    <div>
                      <span className="text-base font-semibold text-app-text">{tool.name}</span>
                      <span className="text-sm text-app-text-muted ml-2">({tool.category})</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-red-500">${tool.price}/mo</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-red-500/20 flex items-center justify-between">
              <span className="text-app-text-secondary text-base font-medium">Total per month</span>
              <span className="text-3xl font-extrabold text-red-500 line-through decoration-2">
                ${oldTotal}+
              </span>
            </div>
          </motion.div>

          {/* Masidy */}
          <motion.div
            className="rounded-2xl border border-app-accent/30 bg-app-card shadow-lg shadow-app-accent/5 p-8 relative overflow-hidden"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <h3 className="text-xl font-bold text-app-text">With Masidy</h3>
              </div>

              <div className="space-y-2.5">
                {masidyFeatures.map((feature, i) => (
                  <motion.div
                    key={feature.name}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl bg-app-accent-glow border border-app-accent/10"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: 0.08 * i }}
                  >
                    <span className="shrink-0 opacity-70">{feature.icon}</span>
                    <span className="text-base font-semibold text-app-text">{feature.name}</span>
                    <span className="ml-auto text-sm font-medium text-app-accent-text">Included</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-app-accent/20 flex items-center justify-between">
                <span className="text-app-text-secondary text-base font-medium">Total per month</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold gradient-text">$49</span>
                  <span className="text-app-text-muted text-sm">/mo</span>
                </div>
              </div>

              <motion.div
                className="mt-5 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-lg font-bold">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                  Save ${savings}/mo
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
