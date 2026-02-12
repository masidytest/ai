"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const points = [
  {
    title: "Prompt to app",
    description: "Describe what you need in plain English and Masidy generates a full-stack application — frontend, backend, database, and deployment config.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-app-accent-text"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
    ),
    color: "#818cf8",
    steps: [
      "Analyzing prompt...",
      "Generating frontend (Next.js + Tailwind)",
      "Generating backend (Express + Prisma)",
      "Creating database schema...",
      "Writing deployment config...",
      "Full-stack app ready!",
    ],
  },
  {
    title: "Import existing repos",
    description: "Connect your GitHub, GitLab, or Bitbucket repos. Masidy scans your codebase and adds AI superpowers to your existing stack.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-app-accent-text"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a6 6 0 006 6h3"/></svg>
    ),
    color: "#a855f7",
    steps: [
      "Connecting to GitHub...",
      "Scanning 47 files...",
      "Detected: Next.js + Prisma",
      "Adding AI code assistant...",
      "Indexing project context...",
      "Repository imported!",
    ],
  },
  {
    title: "Deploy globally",
    description: "Ship to your own cloud, our managed infrastructure, or both. One-click deploys with auto-scaling, SSL, and CDN built in.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-app-accent-text"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
    ),
    color: "#10b981",
    steps: [
      "Building production bundle...",
      "Provisioning SSL certificate...",
      "Deploying to US-East...",
      "Deploying to EU-West...",
      "Deploying to APAC...",
      "Live on 12 regions!",
    ],
  },
  {
    title: "Automate everything",
    description: "AI generates workflows from descriptions. Connect Stripe, Slack, databases, APIs, and cron jobs into visual pipelines that run 24/7.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-app-accent-text"><path d="M4 14a1 1 0 01-.78-1.63l9-11a1 1 0 011.78.63v7h5a1 1 0 01.78 1.63l-9 11a1 1 0 01-1.78-.63v-7H4z"/></svg>
    ),
    color: "#f59e0b",
    steps: [
      "Parsing workflow description...",
      "Adding Stripe webhook trigger...",
      "Connecting Slack notification...",
      "Setting up database sync...",
      "Scheduling cron job (daily)...",
      "Workflow running 24/7!",
    ],
  },
];

export function IntegrationPoints() {
  const [active, setActive] = useState(0);
  const [lineStep, setLineStep] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef = useRef(0);
  const lineRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const tick = () => {
      lineRef.current += 1;
      if (lineRef.current >= 6) {
        // Move to next card
        const next = (activeRef.current + 1) % points.length;
        activeRef.current = next;
        lineRef.current = 0;
        setActive(next);
        setLineStep(0);
      } else {
        setLineStep(lineRef.current);
      }
    };

    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timerRef.current) {
          activeRef.current = 0;
          lineRef.current = 0;
          setActive(0);
          setLineStep(0);
          timerRef.current = setInterval(tick, 600);
        }
        if (!e.isIntersecting && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => { obs.disconnect(); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-24 bg-app-bg-secondary">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-app-text mb-4">
            From idea to production in four steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point, i) => {
            const isActive = i === active;
            const isDone = i < active || (i === active && lineStep >= 5);
            const progress = isActive ? ((lineStep + 1) / 6) * 100 : isDone ? 100 : 0;

            return (
              <motion.div
                key={point.title}
                className="relative flex flex-col items-start rounded-xl border overflow-hidden transition-all"
                style={{
                  borderColor: isActive ? point.color + "50" : isDone ? point.color + "25" : "var(--app-border)",
                  background: isActive ? point.color + "06" : "var(--app-card)",
                  boxShadow: isActive ? `0 0 30px ${point.color}12` : "none",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Progress bar at top */}
                <div className="w-full h-0.5 bg-white/[0.03]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: point.color }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <div className="p-6 flex flex-col items-start w-full">
                  <div className="absolute top-6 right-4 text-3xl font-bold select-none" style={{ color: isDone || isActive ? point.color + "30" : "var(--app-border)" }}>
                    {isDone && !isActive ? (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-lg" style={{ color: point.color }}>&#10003;</motion.span>
                    ) : (
                      i + 1
                    )}
                  </div>
                  <div className="mb-4 p-2.5 rounded-lg" style={{ background: isActive ? point.color + "15" : "var(--app-accent-glow)" }}>
                    {point.icon}
                  </div>
                  <h3 className="text-lg font-bold text-app-text mb-2">{point.title}</h3>
                  <p className="text-app-text-secondary text-sm leading-relaxed mb-3">{point.description}</p>

                  {/* Auto-running terminal lines */}
                  <div className="w-full rounded-lg bg-black/20 border border-white/[0.04] p-2.5 mt-auto min-h-[100px]">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: point.color, opacity: isActive ? 1 : 0.3 }} />
                      <span className="text-[8px] uppercase tracking-wider" style={{ color: isActive ? point.color : "#52525b" }}>
                        {isActive ? "Running..." : isDone ? "Complete" : "Waiting"}
                      </span>
                    </div>
                    {point.steps.map((s, j) => {
                      const show = (isActive && j <= lineStep) || isDone;
                      if (!show) return null;
                      const isLastShown = isActive && j === lineStep && lineStep < 5;
                      return (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-1.5 py-[1px]"
                        >
                          {(isDone && !isActive) || (isActive && j < lineStep) || (isActive && lineStep >= 5 && j <= 5) ? (
                            <span className="text-[9px]" style={{ color: point.color }}>&#10003;</span>
                          ) : isLastShown ? (
                            <span className="w-2 h-2 border border-zinc-700 rounded-full animate-spin" style={{ borderTopColor: point.color }} />
                          ) : (
                            <span className="text-[9px]" style={{ color: point.color }}>&#10003;</span>
                          )}
                          <span className={`text-[10px] font-mono ${isLastShown ? "text-zinc-300" : "text-zinc-500"}`}>{s}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
