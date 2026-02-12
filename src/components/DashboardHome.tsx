"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const cards = [
  { label: "Projects", href: "/dashboard/projects", icon: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Deployments", href: "/dashboard/deployments", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
  { label: "Cloud", href: "/dashboard/cloud", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Database", href: "/dashboard/database", icon: "M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4M4 12c0 2.21 3.58 4 8 4s8-1.79 8-4" },
  { label: "Hosting", href: "/dashboard/hosting", icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" },
  { label: "Domains", href: "/dashboard/domains", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" },
  { label: "Workflows", href: "/dashboard/workflows", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Builder", href: "/dashboard/builder", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { label: "AI IDE", href: "/dashboard/ai-ide", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
];

const quickActions = [
  { label: "New Project", href: "/dashboard/projects" },
  { label: "Deploy", href: "/dashboard/deployments" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Invite Team", href: "/dashboard/settings" },
  { label: "Docs", href: "/docs" },
  { label: "Support", href: "/contact" },
];

const recent = [
  { title: "Deployed new workflow", time: "2m ago" },
  { title: "Added domain: masidy.com", time: "10m ago" },
  { title: "Invited user: jane@corp.com", time: "1h ago" },
  { title: "Upgraded hosting plan", time: "3h ago" },
];

const placeholderPrompts = [
  "Build me a SaaS dashboard with auth and Stripe billing...",
  "Create an e-commerce store with cart and checkout...",
  "Design a real-time chat app with WebSocket support...",
  "Build a project management tool with Kanban boards...",
  "Generate a landing page with dark mode and animations...",
  "Build a REST API with JWT auth and Swagger docs...",
  "Create a multi-tenant platform with role-based access...",
  "Design an admin panel with charts and data tables...",
  "or describe whatever you want to build...",
];

export function DashboardHome() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  // Typewriter placeholder animation
  useEffect(() => {
    if (prompt) return;
    const currentPrompt = placeholderPrompts[placeholderIndex];

    if (isTyping) {
      if (charIndex < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentPrompt.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 28);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentPrompt.slice(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 12);
        return () => clearTimeout(timeout);
      } else {
        setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, placeholderIndex, prompt]);

  const handleBuild = useCallback(() => {
    if (prompt.trim()) {
      router.push(`/dashboard/ai-ide?prompt=${encodeURIComponent(prompt.trim())}`);
    }
  }, [prompt, router]);

  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((f) => f.name).join(", ");
      setPrompt((prev) => prev ? `${prev}\n\n Attached: ${fileNames}` : `Attached: ${fileNames}`);
    }
    e.target.value = "";
  }, []);

  const handleRepoSubmit = useCallback(() => {
    if (repoUrl.trim()) {
      router.push(`/dashboard/ai-ide?repo=${encodeURIComponent(repoUrl.trim())}`);
    }
    setShowGitModal(false);
    setRepoUrl("");
  }, [repoUrl, router]);

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl md:text-4xl font-bold text-app-text mb-2">
        Welcome back, <span className="gradient-text">User</span>!
      </h1>
      <p className="text-app-text-muted mb-6">What do you want to build today?</p>

      {/* AI Prompt Box */}
      <motion.div
        className="w-full max-w-3xl rounded-2xl border border-app-border bg-app-card shadow-2xl shadow-black/10 overflow-hidden mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-5 relative">
          <textarea
            className="w-full bg-transparent border-none outline-none text-app-text text-base resize-none leading-relaxed relative z-10"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleBuild();
              }
            }}
          />
          {/* Animated placeholder */}
          {!prompt && (
            <div className="absolute inset-0 px-5 pt-5 pointer-events-none z-0">
              <span className="text-app-text-muted text-base leading-relaxed">
                {displayedPlaceholder}
                <motion.span
                  className="inline-block w-[2px] h-[1.1em] bg-app-accent ml-0.5 align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
                />
              </span>
            </div>
          )}
        </div>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
          accept=".js,.ts,.tsx,.jsx,.json,.html,.css,.py,.go,.rs,.md,.txt,.zip,.tar.gz"
        />
        <div className="flex items-center justify-between px-5 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAttach}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-app-text-muted hover:text-app-text-secondary hover:bg-app-surface transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/></svg>
              Attach
            </button>
            <button
              onClick={() => setShowGitModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-app-text-muted hover:text-app-text-secondary hover:bg-app-surface transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z"/></svg>
              Import repo
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-app-text-muted hidden sm:inline">Enter ↵</span>
            <button
              onClick={handleBuild}
              disabled={!prompt.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors shadow-lg shadow-app-accent-glow disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Build now
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Git Import Modal */}
      <AnimatePresence>
        {showGitModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGitModal(false)}
          >
            <motion.div
              className="bg-app-card border border-app-border rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-app-text mb-1">Import from Git</h3>
              <p className="text-sm text-app-text-muted mb-5">Paste a GitHub, GitLab, or Bitbucket repository URL to import your project.</p>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors mb-4"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleRepoSubmit()}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowGitModal(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-app-text-secondary hover:bg-app-surface transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepoSubmit}
                  disabled={!repoUrl.trim()}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-app-btn-primary text-app-btn-primary-text hover:bg-app-btn-primary-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Import & Open IDE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            className="bg-app-card border border-app-border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm cursor-pointer hover:border-app-accent/30 hover:shadow-lg transition-all group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -6 }}
            onClick={() => router.push(card.href)}
          >
            <div className="w-12 h-12 rounded-xl bg-app-accent/10 flex items-center justify-center mb-3 group-hover:bg-app-accent/15 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={card.icon}/></svg>
            </div>
            <span className="text-lg font-semibold text-app-text">{card.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Recent Activity */}
        <div className="flex-1 bg-app-card border border-app-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-app-text mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {recent.map((item, i) => (
              <li key={i} className="flex items-center justify-between text-app-text-secondary">
                <span>{item.title}</span>
                <span className="text-xs text-app-text-muted">{item.time}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-app-text mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(action.href)}
                className="px-5 py-2.5 rounded-full bg-app-card border border-app-border text-app-text font-medium text-sm transition-colors hover:border-app-accent/30 hover:bg-app-accent/5 focus:outline-none"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
