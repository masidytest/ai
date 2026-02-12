"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../components/Footer";

const guides = [
  { title: "Getting Started with Masidy", desc: "Set up your account, create your first project, and deploy in under 5 minutes.", time: "5 min", level: "Beginner", icon: "M13 10V3L4 14h7v7l9-11h-7z", href: "/docs/quick-start" },
  { title: "Building a Full-Stack App", desc: "Use the AI IDE, database, and hosting together to build and ship a complete app.", time: "15 min", level: "Intermediate", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z", href: "/docs/ai-ide" },
  { title: "Custom Domains & SSL", desc: "Connect your own domain, configure DNS records, and enable automatic SSL certificates.", time: "8 min", level: "Beginner", icon: "M12 11c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-6 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-2 0a8 8 0 1116 0 8 8 0 01-16 0z", href: "/docs/domains" },
  { title: "Workflow Automation", desc: "Create event-driven workflows to automate deployments, notifications, and data pipelines.", time: "12 min", level: "Intermediate", icon: "M4 4v5h.58a4.97 4.97 0 012.84-2.84V4H4zm9.58 2.16A4.97 4.97 0 0116.42 9H17V4h-5v2.16zM4 20h3.42v-2.16A4.97 4.97 0 014.58 15H4v5zm13-5h-.58a4.97 4.97 0 01-2.84 2.84V20H17v-5zM12 8a4 4 0 100 8 4 4 0 000-8z", href: "/docs/workflow-automation" },
  { title: "Database Management", desc: "Provision databases, manage schemas, run migrations, and set up backups.", time: "10 min", level: "Intermediate", icon: "M4 7v10c0 2 3.6 4 8 4s8-2 8-4V7M4 7c0 2 3.6 4 8 4s8-2 8-4M4 7c0-2 3.6-4 8-4s8 2 8 4m0 5c0 2-3.6 4-8 4s-8-2-8-4", href: "/docs/database" },
  { title: "CI/CD Pipeline Setup", desc: "Configure continuous integration and deployment with GitHub, GitLab, or Bitbucket.", time: "10 min", level: "Advanced", icon: "M4 4l4 4m0 0l4-4m-4 4v12m12-4l-4 4m0 0l-4-4m4 4V4", href: "/docs/cloud-hosting" },
  { title: "Using the AI Code Assistant", desc: "Learn prompting techniques, context management, and multi-file editing with the AI IDE.", time: "8 min", level: "Beginner", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.3 24.3 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a3.12 3.12 0 01-4.41.44l-.11-.08a3.12 3.12 0 00-4.41.44L5 20", href: "/docs/ai-ide" },
  { title: "Team Collaboration", desc: "Invite team members, manage roles and permissions, and set up code review workflows.", time: "7 min", level: "Beginner", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", href: "/docs/introduction" },
  { title: "Environment Variables & Secrets", desc: "Securely manage config variables across development, staging, and production.", time: "6 min", level: "Intermediate", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", href: "/docs/cloud-hosting" },
];

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function GuidesPage() {
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
            <span className="gradient-text">Guides</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Step-by-step tutorials to help you get the most out of Masidy.
          </motion.p>
        </div>
      </section>

      {/* Guides grid */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((g, i) => (
            <Link
              key={g.title}
              href={g.href}
              className="bg-app-card border border-app-border rounded-2xl p-6 hover:border-app-accent/30 hover:shadow-lg transition-all group block"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={g.icon} /></svg>
              </div>
              <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors mb-2">{g.title}</h3>
              <p className="text-sm text-app-text-muted leading-relaxed mb-4">{g.desc}</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${levelColor[g.level]}`}>{g.level}</span>
                <span className="text-xs text-app-text-muted">{g.time} read</span>
              </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
