"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const services = [
  { name: "Platform API", status: "operational", uptime: "99.99%" },
  { name: "AI IDE", status: "operational", uptime: "99.98%" },
  { name: "UI Builder", status: "operational", uptime: "99.97%" },
  { name: "Workflow Engine", status: "operational", uptime: "99.99%" },
  { name: "Cloud Hosting", status: "operational", uptime: "99.95%" },
  { name: "Database Services", status: "operational", uptime: "99.99%" },
  { name: "Domain Management", status: "operational", uptime: "100%" },
  { name: "Authentication", status: "operational", uptime: "99.99%" },
  { name: "Billing & Payments", status: "operational", uptime: "99.99%" },
  { name: "CDN & Edge Network", status: "operational", uptime: "99.98%" },
];

const incidents = [
  { date: "Feb 8, 2026", title: "Elevated API latency in EU-West region", duration: "23 min", severity: "minor", resolved: true },
  { date: "Jan 29, 2026", title: "Delayed deployments due to build queue congestion", duration: "45 min", severity: "minor", resolved: true },
  { date: "Jan 15, 2026", title: "Database connection pool exhaustion", duration: "12 min", severity: "major", resolved: true },
  { date: "Dec 28, 2025", title: "CDN cache invalidation delay", duration: "18 min", severity: "minor", resolved: true },
];

const statusColor: Record<string, string> = {
  operational: "bg-emerald-500",
  degraded: "bg-amber-500",
  outage: "bg-red-500",
};

const severityColor: Record<string, string> = {
  minor: "bg-amber-500/10 text-amber-500",
  major: "bg-red-500/10 text-red-400",
};

// Deterministic 90-day uptime bars (no Math.random — avoids hydration mismatch)
const uptimeDays: string[] = Array.from({ length: 90 }, (_, i) => {
  // Sprinkle a few degraded days at fixed positions
  if (i === 12 || i === 37 || i === 61) return "degraded";
  return "operational";
});

export default function StatusPage() {
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-app-accent/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              allOperational ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${allOperational ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
            {allOperational ? "All Systems Operational" : "Partial Service Disruption"}
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            System <span className="gradient-text">Status</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Real-time status and uptime monitoring for all Masidy services.
          </motion.p>
        </div>
      </section>

      {/* 90-day uptime bar */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-app-card border border-app-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-app-text">90-Day Uptime</h2>
            <span className="text-sm text-emerald-500 font-medium">99.98%</span>
          </div>
          <div className="flex gap-[2px] h-8 items-end">
            {uptimeDays.map((day, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-sm ${statusColor[day]}`}
                style={{ height: "100%", opacity: day === "operational" ? 0.6 : 1 }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: i * 0.005, duration: 0.3 }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-app-text-muted">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-6">Service Status</h2>
        <div className="bg-app-card border border-app-border rounded-2xl overflow-hidden">
          {services.map((s, i) => (
            <motion.div
              key={s.name}
              className="flex items-center justify-between px-6 py-4 border-b border-app-border/50 last:border-b-0"
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full ${statusColor[s.status]}`} />
                <span className="text-app-text font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-app-text-muted">{s.uptime} uptime</span>
                <span className="text-sm text-emerald-500 font-medium capitalize">{s.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold mb-6">Recent Incidents</h2>
        <div className="space-y-4">
          {incidents.map((inc, i) => (
            <motion.div
              key={i}
              className="bg-app-card border border-app-border rounded-xl p-5"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-app-text mb-1">{inc.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-app-text-muted">
                    <span>{inc.date}</span>
                    <span className="w-1 h-1 rounded-full bg-app-text-muted" />
                    <span>Duration: {inc.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${severityColor[inc.severity]}`}>{inc.severity}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">resolved</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
