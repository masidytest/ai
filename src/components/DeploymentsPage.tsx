"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DeployStatus = "success" | "building" | "failed" | "cancelled";

interface Deployment {
  id: number;
  project: string;
  branch: string;
  commit: string;
  status: DeployStatus;
  env: string;
  duration: string;
  time: string;
  author: string;
}

const deployments: Deployment[] = [
  { id: 1, project: "masidy-web", branch: "main", commit: "a3f82c1", status: "success", env: "production", duration: "2m 14s", time: "5 min ago", author: "admin" },
  { id: 2, project: "api-gateway", branch: "main", commit: "b7d91e4", status: "success", env: "production", duration: "1m 48s", time: "2 hours ago", author: "admin" },
  { id: 3, project: "dashboard-v2", branch: "feature/auth", commit: "c2e55f8", status: "building", env: "staging", duration: "...", time: "just now", author: "jane" },
  { id: 4, project: "api-gateway", branch: "fix/rate-limit", commit: "d4a12b6", status: "failed", env: "staging", duration: "0m 42s", time: "3 hours ago", author: "admin" },
  { id: 5, project: "masidy-web", branch: "main", commit: "e9f7a33", status: "success", env: "production", duration: "2m 08s", time: "6 hours ago", author: "admin" },
  { id: 6, project: "mobile-app", branch: "release/2.1", commit: "f1c44d2", status: "success", env: "production", duration: "4m 32s", time: "1 day ago", author: "mike" },
  { id: 7, project: "analytics-service", branch: "main", commit: "g8b22a1", status: "cancelled", env: "staging", duration: "0m 15s", time: "1 day ago", author: "admin" },
  { id: 8, project: "landing-page", branch: "main", commit: "h5e19c7", status: "success", env: "production", duration: "1m 22s", time: "2 days ago", author: "admin" },
];

const statusConfig: Record<DeployStatus, { color: string; label: string; icon: string }> = {
  success: { color: "bg-emerald-500/10 text-emerald-500", label: "Success", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  building: { color: "bg-blue-500/10 text-blue-400", label: "Building", icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" },
  failed: { color: "bg-red-500/10 text-red-400", label: "Failed", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
  cancelled: { color: "bg-gray-500/10 text-gray-400", label: "Cancelled", icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" },
};

const statusFilters: { label: string; value: DeployStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Success", value: "success" },
  { label: "Building", value: "building" },
  { label: "Failed", value: "failed" },
  { label: "Cancelled", value: "cancelled" },
];

export function DeploymentsPage() {
  const [filter, setFilter] = useState<DeployStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = filter === "all" ? deployments : deployments.filter((d) => d.status === filter);

  const stats = {
    total: deployments.length,
    success: deployments.filter((d) => d.status === "success").length,
    failed: deployments.filter((d) => d.status === "failed").length,
    avgDuration: "2m 01s",
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-app-text">Deployments</h1>
          <p className="text-app-text-muted mt-1">Track and manage all your deployments</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          New Deploy
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Deploys", value: stats.total, icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
          { label: "Successful", value: stats.success, icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Failed", value: stats.failed, icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" },
          { label: "Avg Duration", value: stats.avgDuration, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-app-card border border-app-border rounded-xl p-4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
              </div>
              <span className="text-xs text-app-text-muted">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold text-app-text">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {statusFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30"
                : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-accent/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Deployment List */}
      <div className="space-y-3">
        {filtered.map((deploy, i) => {
          const cfg = statusConfig[deploy.status];
          const expanded = expandedId === deploy.id;
          return (
            <motion.div
              key={deploy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-app-card border border-app-border rounded-xl overflow-hidden hover:border-app-accent/30 transition-all cursor-pointer"
              onClick={() => setExpandedId(expanded ? null : deploy.id)}
            >
              <div className="flex items-center gap-4 p-4">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={cfg.icon}/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-app-text">{deploy.project}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-xs text-app-text-muted">{deploy.env}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-app-text-muted mt-1">
                    <span>{deploy.branch}</span>
                    <span className="font-mono">{deploy.commit}</span>
                    <span>{deploy.duration}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-app-text-muted">{deploy.time}</span>
                  <div className="text-xs text-app-text-muted mt-0.5">by {deploy.author}</div>
                </div>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="shrink-0">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </motion.div>
              </div>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-app-border/50 bg-app-bg-secondary/30">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-app-text-muted">Branch</span>
                          <p className="text-app-text font-mono">{deploy.branch}</p>
                        </div>
                        <div>
                          <span className="text-app-text-muted">Commit</span>
                          <p className="text-app-text font-mono">{deploy.commit}</p>
                        </div>
                        <div>
                          <span className="text-app-text-muted">Duration</span>
                          <p className="text-app-text">{deploy.duration}</p>
                        </div>
                        <div>
                          <span className="text-app-text-muted">Triggered by</span>
                          <p className="text-app-text">{deploy.author}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="px-3 py-1.5 rounded-lg bg-app-card border border-app-border text-app-text-secondary hover:text-app-text text-xs font-medium transition-colors hover:border-app-accent/20">
                          View Logs
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-app-card border border-app-border text-app-text-secondary hover:text-app-text text-xs font-medium transition-colors hover:border-app-accent/20">
                          Redeploy
                        </button>
                        {deploy.status === "success" && (
                          <button className="px-3 py-1.5 rounded-lg bg-app-card border border-app-border text-app-text-secondary hover:text-red-400 text-xs font-medium transition-colors hover:border-red-500/20">
                            Rollback
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-app-text-muted">
            No deployments found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}
