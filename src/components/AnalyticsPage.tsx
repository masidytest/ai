"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const periods = ["24h", "7d", "30d", "90d"];

const overviewStats = [
  { label: "Total Requests", value: "1.24M", change: "+12.3%", up: true, icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { label: "Avg Response", value: "142ms", change: "-8.1%", up: true, icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "Error Rate", value: "0.03%", change: "-2.1%", up: true, icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  { label: "Active Users", value: "3,847", change: "+24.5%", up: true, icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
];

const trafficData = [
  { hour: "00:00", reqs: 2400 }, { hour: "02:00", reqs: 1800 }, { hour: "04:00", reqs: 1200 },
  { hour: "06:00", reqs: 3200 }, { hour: "08:00", reqs: 5800 }, { hour: "10:00", reqs: 8200 },
  { hour: "12:00", reqs: 9400 }, { hour: "14:00", reqs: 8800 }, { hour: "16:00", reqs: 7600 },
  { hour: "18:00", reqs: 6800 }, { hour: "20:00", reqs: 5200 }, { hour: "22:00", reqs: 3600 },
];

const topPages = [
  { path: "/api/v1/users", hits: "245K", avg: "89ms" },
  { path: "/api/v1/projects", hits: "189K", avg: "112ms" },
  { path: "/dashboard", hits: "156K", avg: "204ms" },
  { path: "/api/v1/deployments", hits: "134K", avg: "156ms" },
  { path: "/api/v1/auth/login", hits: "98K", avg: "67ms" },
];

const regions = [
  { name: "North America", pct: 42, color: "bg-indigo-500" },
  { name: "Europe", pct: 31, color: "bg-purple-500" },
  { name: "Asia Pacific", pct: 18, color: "bg-cyan-500" },
  { name: "South America", pct: 6, color: "bg-emerald-500" },
  { name: "Other", pct: 3, color: "bg-amber-500" },
];

export function AnalyticsPage() {
  const [period, setPeriod] = useState("7d");

  const maxReqs = Math.max(...trafficData.map((d) => d.reqs));

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-app-text">Analytics</h1>
          <p className="text-app-text-muted mt-1">Monitor performance, traffic, and usage across your platform</p>
        </div>
        <div className="flex bg-app-card border border-app-border rounded-lg overflow-hidden">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                period === p
                  ? "bg-app-accent/15 text-app-accent-text"
                  : "text-app-text-muted hover:text-app-text"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="bg-app-card border border-app-border rounded-xl p-5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-app-accent/10 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={stat.icon}/></svg>
              </div>
              <span className="text-sm text-app-text-muted">{stat.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-app-text">{stat.value}</span>
              <span className={`text-xs font-medium ${stat.up ? "text-emerald-500" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Traffic Chart (CSS bar chart) */}
      <motion.div
        className="bg-app-card border border-app-border rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-app-text mb-6">Request Traffic</h2>
        <div className="flex items-end gap-2 h-48">
          {trafficData.map((d, i) => (
            <div key={d.hour} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/80 to-purple-500/60 min-h-[4px]"
                initial={{ height: 0 }}
                animate={{ height: `${(d.reqs / maxReqs) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: "easeOut" }}
              />
              <span className="text-[10px] text-app-text-muted">{d.hour}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Endpoints */}
        <motion.div
          className="bg-app-card border border-app-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-lg font-semibold text-app-text mb-4">Top Endpoints</h2>
          <div className="space-y-3">
            {topPages.map((page, i) => (
              <div key={page.path} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-app-text-muted w-5">{i + 1}</span>
                  <code className="text-sm text-app-text font-mono">{page.path}</code>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-app-text-secondary">{page.hits}</span>
                  <span className="text-app-text-muted w-16 text-right">{page.avg}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Traffic by Region */}
        <motion.div
          className="bg-app-card border border-app-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h2 className="text-lg font-semibold text-app-text mb-4">Traffic by Region</h2>
          <div className="space-y-4">
            {regions.map((region) => (
              <div key={region.name}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-app-text-secondary">{region.name}</span>
                  <span className="text-app-text font-medium">{region.pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-app-bg overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${region.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${region.pct}%` }}
                    transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
