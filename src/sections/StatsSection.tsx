"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ── Premium SVG icons ── */
const icons = {
  developers: (c: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  ),
  apps: (c: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  ),
  uptime: (c: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  countries: (c: string) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
};

const stats = [
  { value: 50, suffix: "K+", label: "Developers", icon: icons.developers, color: "#818cf8" },
  { value: 2, suffix: "M+", label: "Apps Built", icon: icons.apps, color: "#a855f7" },
  { value: 99.99, suffix: "%", label: "Uptime SLA", decimals: 2, icon: icons.uptime, color: "#10b981" },
  { value: 150, suffix: "+", label: "Countries", icon: icons.countries, color: "#22d3ee" },
];

function AnimatedNumber({ value, suffix, decimals = 0, color }: { value: number; suffix: string; decimals?: number; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2200;
          const start = performance.now();
          function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(eased * value);
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <span className="text-5xl md:text-7xl font-black tabular-nums" style={{ color }}>
        {display.toFixed(decimals).replace(/\.00$/, "")}
      </span>
      <span className="text-3xl md:text-5xl font-extrabold gradient-text">{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="w-full py-24 bg-app-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="relative text-center p-8 rounded-2xl border border-app-border bg-app-card shadow-sm hover:shadow-lg hover:border-white/[0.12] transition-all group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {/* Glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${stat.color}10, transparent 70%)` }}
              />

              <div className="flex justify-center mb-4 opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.icon(stat.color)}
              </div>

              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals}
                color={stat.color}
              />

              <p className="text-app-text-secondary text-base font-semibold uppercase tracking-wider mt-3">
                {stat.label}
              </p>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full"
                style={{ background: stat.color }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
