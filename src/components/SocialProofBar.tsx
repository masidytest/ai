"use client";

import { motion } from "framer-motion";

const companies = [
  { name: "GitHub", color: "#f0f6fc" },
  { name: "Shopify", color: "#96bf48" },
  { name: "Stripe", color: "#635bff" },
  { name: "Linear", color: "#5e6ad2" },
  { name: "Notion", color: "#fff" },
  { name: "Vercel", color: "#fff" },
  { name: "AWS", color: "#ff9900" },
  { name: "Figma", color: "#a259ff" },
  { name: "Slack", color: "#e01e5a" },
  { name: "GitLab", color: "#fc6d26" },
  { name: "Discord", color: "#5865f2" },
  { name: "Jira", color: "#0052cc" },
  { name: "Datadog", color: "#632ca6" },
  { name: "Bitbucket", color: "#2684ff" },
];

const doubled = [...companies, ...companies];

export function SocialProofBar() {
  return (
    <section className="w-full py-10 bg-app-bg overflow-hidden">
      <motion.p
        className="text-center text-sm font-semibold text-app-text-muted uppercase tracking-widest mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Trusted by 10,000+ teams at
      </motion.p>

      <div className="relative">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--app-bg)] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--app-bg)] to-transparent z-10" />

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: [0, -(companies.length * 160)] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {doubled.map((co, i) => (
            <div
              key={`${co.name}-${i}`}
              className="flex items-center gap-2.5 shrink-0 opacity-40 hover:opacity-80 transition-opacity"
            >
              {/* Stylized letter logo */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: co.color + "18", color: co.color }}
              >
                {co.name[0]}
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: co.color }}
              >
                {co.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Metric badges */}
      <motion.div
        className="flex items-center justify-center gap-8 mt-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        {[
          { val: "10K+", label: "teams" },
          { val: "2M+", label: "apps shipped" },
          { val: "150+", label: "countries" },
        ].map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span className="text-lg font-extrabold gradient-text">{m.val}</span>
            <span className="text-sm text-app-text-muted">{m.label}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
