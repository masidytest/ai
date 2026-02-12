"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const releases = [
  {
    version: "2.5.0",
    date: "Feb 10, 2026",
    tag: "latest",
    changes: [
      { type: "feature", text: "AI Workflow Generator with natural language to automation pipelines" },
      { type: "feature", text: "Real-time collaborative editing in AI IDE" },
      { type: "improvement", text: "3x faster deployment pipeline with parallel builds" },
      { type: "fix", text: "Fixed domain SSL auto-renewal race condition" },
    ],
  },
  {
    version: "2.4.1",
    date: "Jan 28, 2026",
    tag: "",
    changes: [
      { type: "feature", text: "Database branching for staging environments" },
      { type: "improvement", text: "Improved AI code suggestions with GPT-4.5 integration" },
      { type: "fix", text: "Resolved WebSocket disconnection on long-running builds" },
      { type: "fix", text: "Fixed billing proration calculation for mid-cycle upgrades" },
    ],
  },
  {
    version: "2.4.0",
    date: "Jan 15, 2026",
    tag: "",
    changes: [
      { type: "feature", text: "Multi-region deployment support for Cloud Hosting" },
      { type: "feature", text: "Custom domain email forwarding" },
      { type: "improvement", text: "Redesigned analytics dashboard with real-time metrics" },
      { type: "improvement", text: "50% reduction in cold start times" },
    ],
  },
  {
    version: "2.3.0",
    date: "Dec 20, 2025",
    tag: "",
    changes: [
      { type: "feature", text: "UI Builder component marketplace with 200+ templates" },
      { type: "feature", text: "GitHub and GitLab integration for CI/CD" },
      { type: "improvement", text: "Overhauled notification system with webhooks" },
      { type: "fix", text: "Fixed memory leak in workflow execution engine" },
    ],
  },
  {
    version: "2.2.0",
    date: "Nov 30, 2025",
    tag: "",
    changes: [
      { type: "feature", text: "SOC 2 Type II compliance achieved" },
      { type: "feature", text: "Enterprise SSO with SAML 2.0" },
      { type: "improvement", text: "Improved RBAC with project-level permissions" },
    ],
  },
];

const typeColor: Record<string, string> = {
  feature: "bg-indigo-500/10 text-indigo-400",
  improvement: "bg-cyan-500/10 text-cyan-400",
  fix: "bg-amber-500/10 text-amber-400",
};

const typeLabel: Record<string, string> = {
  feature: "New",
  improvement: "Improved",
  fix: "Fixed",
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-app-accent/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">Changelog</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            New features, improvements, and fixes shipped to the Masidy platform.
          </motion.p>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="relative border-l-2 border-app-border pl-8 space-y-12">
          {releases.map((r, ri) => (
            <motion.div
              key={r.version}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: ri * 0.06 }}
            >
              <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-app-accent border-4 border-app-bg" />
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-bold text-app-text">v{r.version}</h2>
                {r.tag && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">{r.tag}</span>
                )}
                <span className="text-sm text-app-text-muted">{r.date}</span>
              </div>
              <ul className="space-y-2.5">
                {r.changes.map((c, ci) => (
                  <li key={ci} className="flex items-start gap-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium shrink-0 mt-0.5 ${typeColor[c.type]}`}>
                      {typeLabel[c.type]}
                    </span>
                    <span className="text-sm text-app-text-secondary">{c.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
