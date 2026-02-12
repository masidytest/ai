"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Footer } from "../../components/Footer";

const endpoints = [
  {
    method: "GET",
    path: "/v1/projects",
    desc: "List all projects in the authenticated workspace.",
    auth: true,
    params: [
      { name: "page", type: "integer", required: false, desc: "Page number for pagination (default: 1)" },
      { name: "limit", type: "integer", required: false, desc: "Results per page, max 100 (default: 20)" },
      { name: "status", type: "string", required: false, desc: "Filter by status: active, archived, or all" },
    ],
    response: `{
  "data": [
    {
      "id": "proj_abc123",
      "name": "My SaaS App",
      "status": "active",
      "framework": "next.js",
      "created_at": "2026-01-15T08:30:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 42 }
}`,
    category: "Projects",
  },
  {
    method: "POST",
    path: "/v1/projects",
    desc: "Create a new project in the workspace.",
    auth: true,
    params: [
      { name: "name", type: "string", required: true, desc: "Project name (3-64 characters)" },
      { name: "framework", type: "string", required: false, desc: "Framework: nextjs, react, vue, node, static" },
      { name: "region", type: "string", required: false, desc: "Deploy region: us-east-1, eu-west-1, ap-south-1" },
    ],
    response: `{
  "id": "proj_def456",
  "name": "New Project",
  "framework": "nextjs",
  "region": "us-east-1",
  "status": "active",
  "created_at": "2026-02-12T14:20:00Z"
}`,
    category: "Projects",
  },
  {
    method: "DELETE",
    path: "/v1/projects/:id",
    desc: "Delete a project and all associated resources.",
    auth: true,
    params: [
      { name: "id", type: "string", required: true, desc: "Project ID (path parameter)" },
      { name: "force", type: "boolean", required: false, desc: "Skip confirmation and delete immediately" },
    ],
    response: `{ "deleted": true, "id": "proj_abc123" }`,
    category: "Projects",
  },
  {
    method: "GET",
    path: "/v1/deployments",
    desc: "List deployments for a project.",
    auth: true,
    params: [
      { name: "project_id", type: "string", required: true, desc: "Project ID to list deployments for" },
      { name: "status", type: "string", required: false, desc: "Filter: building, ready, failed, cancelled" },
      { name: "limit", type: "integer", required: false, desc: "Results per page (default: 20)" },
    ],
    response: `{
  "data": [
    {
      "id": "dpl_xyz789",
      "project_id": "proj_abc123",
      "status": "ready",
      "url": "https://my-app-abc123.masidy.app",
      "commit": "a1b2c3d",
      "created_at": "2026-02-12T10:15:00Z"
    }
  ]
}`,
    category: "Deployments",
  },
  {
    method: "POST",
    path: "/v1/deployments",
    desc: "Trigger a new deployment for a project.",
    auth: true,
    params: [
      { name: "project_id", type: "string", required: true, desc: "Project ID to deploy" },
      { name: "branch", type: "string", required: false, desc: "Git branch to deploy (default: main)" },
      { name: "environment", type: "string", required: false, desc: "Target environment: production, preview, staging" },
    ],
    response: `{
  "id": "dpl_new001",
  "project_id": "proj_abc123",
  "status": "building",
  "branch": "main",
  "environment": "production",
  "created_at": "2026-02-12T14:30:00Z"
}`,
    category: "Deployments",
  },
  {
    method: "POST",
    path: "/v1/deployments/:id/rollback",
    desc: "Rollback to a previous deployment.",
    auth: true,
    params: [
      { name: "id", type: "string", required: true, desc: "Deployment ID to rollback to (path parameter)" },
    ],
    response: `{
  "id": "dpl_rb002",
  "status": "building",
  "rollback_from": "dpl_new001",
  "rollback_to": "dpl_xyz789"
}`,
    category: "Deployments",
  },
  {
    method: "GET",
    path: "/v1/databases",
    desc: "List all database instances.",
    auth: true,
    params: [
      { name: "engine", type: "string", required: false, desc: "Filter by engine: postgres, mysql, redis, mongodb" },
    ],
    response: `{
  "data": [
    {
      "id": "db_pg001",
      "name": "production-db",
      "engine": "postgres",
      "version": "16",
      "region": "us-east-1",
      "status": "running",
      "size_gb": 10
    }
  ]
}`,
    category: "Database",
  },
  {
    method: "POST",
    path: "/v1/databases",
    desc: "Provision a new database instance.",
    auth: true,
    params: [
      { name: "name", type: "string", required: true, desc: "Database name" },
      { name: "engine", type: "string", required: true, desc: "Engine: postgres, mysql, redis, mongodb" },
      { name: "region", type: "string", required: false, desc: "Region (default: us-east-1)" },
      { name: "plan", type: "string", required: false, desc: "Plan: hobby, pro, business (default: hobby)" },
    ],
    response: `{
  "id": "db_pg002",
  "name": "staging-db",
  "engine": "postgres",
  "version": "16",
  "status": "provisioning",
  "connection_string": "postgres://user:****@db-pg002.masidy.cloud:5432/staging"
}`,
    category: "Database",
  },
  {
    method: "GET",
    path: "/v1/domains",
    desc: "List all custom domains.",
    auth: true,
    params: [
      { name: "project_id", type: "string", required: false, desc: "Filter by project" },
      { name: "verified", type: "boolean", required: false, desc: "Filter by verification status" },
    ],
    response: `{
  "data": [
    {
      "id": "dom_001",
      "domain": "app.example.com",
      "project_id": "proj_abc123",
      "verified": true,
      "ssl": "active",
      "created_at": "2026-01-20T12:00:00Z"
    }
  ]
}`,
    category: "Domains",
  },
  {
    method: "POST",
    path: "/v1/domains",
    desc: "Add a custom domain to a project.",
    auth: true,
    params: [
      { name: "domain", type: "string", required: true, desc: "Domain name (e.g. app.example.com)" },
      { name: "project_id", type: "string", required: true, desc: "Project to attach the domain to" },
    ],
    response: `{
  "id": "dom_002",
  "domain": "api.example.com",
  "project_id": "proj_abc123",
  "verified": false,
  "dns_records": [
    { "type": "CNAME", "name": "api", "value": "cname.masidy.app" }
  ]
}`,
    category: "Domains",
  },
  {
    method: "GET",
    path: "/v1/workflows",
    desc: "List workflow automations.",
    auth: true,
    params: [
      { name: "project_id", type: "string", required: false, desc: "Filter by project" },
      { name: "active", type: "boolean", required: false, desc: "Filter by active/inactive" },
    ],
    response: `{
  "data": [
    {
      "id": "wf_001",
      "name": "Deploy on Push",
      "trigger": "git.push",
      "active": true,
      "last_run": "2026-02-12T09:00:00Z",
      "runs_count": 142
    }
  ]
}`,
    category: "Workflows",
  },
  {
    method: "POST",
    path: "/v1/ai/generate",
    desc: "Generate code using the AI engine.",
    auth: true,
    params: [
      { name: "prompt", type: "string", required: true, desc: "Natural language prompt describing what to generate" },
      { name: "language", type: "string", required: false, desc: "Target language: typescript, python, go, rust" },
      { name: "context", type: "string[]", required: false, desc: "Array of file paths for context" },
      { name: "max_tokens", type: "integer", required: false, desc: "Max output tokens (default: 2048)" },
    ],
    response: `{
  "id": "gen_001",
  "code": "export function calculateTotal(items: CartItem[]): number {\\n  return items.reduce((sum, item) => sum + item.price * item.qty, 0);\\n}",
  "language": "typescript",
  "tokens_used": 87,
  "model": "masidy-code-v3"
}`,
    category: "AI",
  },
];

const methodColors: Record<string, { bg: string; text: string }> = {
  GET: { bg: "bg-emerald-500/10", text: "text-emerald-500" },
  POST: { bg: "bg-blue-500/10", text: "text-blue-400" },
  PUT: { bg: "bg-amber-500/10", text: "text-amber-500" },
  PATCH: { bg: "bg-amber-500/10", text: "text-amber-500" },
  DELETE: { bg: "bg-red-500/10", text: "text-red-400" },
};

const categories = ["All", ...Array.from(new Set(endpoints.map((e) => e.category)))];

export default function ApiReferencePage() {
  const [active, setActive] = useState("All");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = active === "All" ? endpoints : endpoints.filter((e) => e.category === active);

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
            <span className="gradient-text">API Reference</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Build on the Masidy platform with a complete REST API. Authenticate with a Bearer token.
          </motion.p>

          {/* Base URL */}
          <motion.div
            className="mt-8 inline-block bg-app-card border border-app-border rounded-xl px-6 py-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <span className="text-xs text-app-text-muted mr-2">Base URL</span>
            <code className="text-sm font-mono text-app-accent-text">https://api.masidy.com</code>
          </motion.div>
        </div>
      </section>

      {/* Auth box */}
      <section className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-app-card border border-app-border rounded-2xl p-6">
          <h2 className="font-semibold text-app-text mb-3">Authentication</h2>
          <p className="text-sm text-app-text-muted mb-4">
            All requests require a Bearer token in the <code className="text-app-accent-text bg-app-accent/5 px-1.5 py-0.5 rounded text-xs">Authorization</code> header.
            Generate tokens from <a href="/dashboard/settings" className="text-app-accent-text hover:underline">Dashboard &rarr; Settings &rarr; API Keys</a>.
          </p>
          <div className="bg-app-bg rounded-xl p-4 font-mono text-sm overflow-x-auto">
            <span className="text-app-text-muted">curl</span>{" "}
            <span className="text-emerald-400">-H</span>{" "}
            <span className="text-amber-400">&quot;Authorization: Bearer mk_live_your_token&quot;</span>{" "}
            <span className="text-app-text-muted">\</span>
            <br />
            {"  "}https://api.masidy.com/v1/projects
          </div>
        </div>
      </section>

      {/* Category filters */}
      <section className="max-w-4xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => { setActive(c); setExpanded(null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                active === c
                  ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30"
                  : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-accent/20"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Endpoints */}
      <section className="max-w-4xl mx-auto px-4 py-8 pb-20 space-y-3">
        {filtered.map((ep, i) => {
          const mc = methodColors[ep.method];
          const isOpen = expanded === i;
          return (
            <motion.div
              key={`${ep.method}-${ep.path}`}
              className="bg-app-card border border-app-border rounded-xl overflow-hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
            >
              {/* Header row */}
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-app-accent/[0.03] transition-colors"
              >
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${mc.bg} ${mc.text} font-mono`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-app-text flex-1">{ep.path}</code>
                <span className="text-xs text-app-text-muted hidden sm:block max-w-[200px] truncate">{ep.desc}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`text-app-text-muted transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {/* Expanded detail */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-app-border/50 pt-4 space-y-5">
                      <p className="text-sm text-app-text-secondary">{ep.desc}</p>

                      {ep.auth && (
                        <div className="flex items-center gap-2 text-xs">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                          <span className="text-amber-500 font-medium">Requires authentication</span>
                        </div>
                      )}

                      {/* Parameters table */}
                      <div>
                        <h4 className="text-sm font-semibold text-app-text mb-2">Parameters</h4>
                        <div className="bg-app-bg rounded-xl overflow-hidden border border-app-border/50">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-app-border/50 text-app-text-muted text-xs">
                                <th className="text-left px-4 py-2 font-medium">Name</th>
                                <th className="text-left px-4 py-2 font-medium">Type</th>
                                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Required</th>
                                <th className="text-left px-4 py-2 font-medium">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {ep.params.map((p) => (
                                <tr key={p.name} className="border-b border-app-border/30 last:border-b-0">
                                  <td className="px-4 py-2 font-mono text-xs text-app-accent-text">{p.name}</td>
                                  <td className="px-4 py-2 text-xs text-app-text-muted">{p.type}</td>
                                  <td className="px-4 py-2 text-xs hidden sm:table-cell">
                                    {p.required ? (
                                      <span className="text-red-400 font-medium">required</span>
                                    ) : (
                                      <span className="text-app-text-muted">optional</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-2 text-xs text-app-text-muted">{p.desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Response */}
                      <div>
                        <h4 className="text-sm font-semibold text-app-text mb-2">Response</h4>
                        <div className="bg-app-bg rounded-xl p-4 font-mono text-xs overflow-x-auto border border-app-border/50">
                          <pre className="text-app-text-secondary whitespace-pre">{ep.response}</pre>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>

      <Footer />
    </div>
  );
}
