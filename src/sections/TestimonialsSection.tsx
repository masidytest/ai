"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Masidy cut our development time by 60%. What used to take weeks now takes hours.",
    name: "Sarah Chen",
    role: "CTO, TechForward",
    avatar: "SC",
    color: "#818cf8",
  },
  {
    quote: "The AI code generation is shockingly good. It understands our codebase and generates production-ready code.",
    name: "Marcus Johnson",
    role: "Engineering Lead, Nexus",
    avatar: "MJ",
    color: "#a855f7",
  },
  {
    quote: "Finally, a platform that lets our designers and developers actually collaborate in real-time.",
    name: "Emily Rodriguez",
    role: "VP Product, Streamline",
    avatar: "ER",
    color: "#10b981",
  },
  {
    quote: "We replaced 5 different tools with Masidy. The workflow automation alone saved us $40k/year.",
    name: "David Park",
    role: "Founder, LaunchPad",
    avatar: "DP",
    color: "#f59e0b",
  },
  {
    quote: "The visual UI builder is insane. Our designers ship production components without writing code.",
    name: "Lisa Wang",
    role: "Design Director, Pixel",
    avatar: "LW",
    color: "#22d3ee",
  },
  {
    quote: "Deploy to 12 regions with one click. Our latency dropped 70% after switching to Masidy hosting.",
    name: "James Miller",
    role: "DevOps Lead, ScaleUp",
    avatar: "JM",
    color: "#6366f1",
  },
];

/* Double the array for seamless loop */
const doubled = [...testimonials, ...testimonials];

function Card({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-[360px] flex flex-col justify-between p-6 rounded-xl border border-app-border bg-app-card shadow-sm hover:border-white/[0.12] transition-colors">
      <p className="text-app-text text-base leading-relaxed mb-5">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: t.color + "30", color: t.color }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-bold text-app-text">{t.name}</div>
          <div className="text-xs text-app-text-muted">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="w-full py-24 bg-app-bg-secondary overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-app-text mb-4">
            Trusted by the best in business
          </h2>
          <p className="text-app-text-secondary text-xl max-w-2xl mx-auto">
            See why thousands of teams choose Masidy to build and ship faster.
          </p>
        </motion.div>
      </div>

      {/* Row 1 — scroll left */}
      <div className="relative mb-5">
        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: [0, -(testimonials.length * 380)] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((t, i) => (
            <Card key={`r1-${i}`} t={t} />
          ))}
        </motion.div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--app-bg-secondary)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--app-bg-secondary)] to-transparent z-10" />
      </div>

      {/* Row 2 — scroll right (reversed) */}
      <div className="relative">
        <motion.div
          className="flex gap-5 w-max"
          animate={{ x: [-(testimonials.length * 380), 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {[...doubled].reverse().map((t, i) => (
            <Card key={`r2-${i}`} t={t} />
          ))}
        </motion.div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--app-bg-secondary)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--app-bg-secondary)] to-transparent z-10" />
      </div>
    </section>
  );
}
