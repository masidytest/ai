"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const rotatingWords = ["build apps", "automate workflows", "design UIs", "manage databases", "deploy globally"];

const placeholderPrompts = [
  "Build me a SaaS dashboard with auth and Stripe billing...",
  "Create an e-commerce store with cart and checkout...",
  "Design a real-time chat app with WebSocket support...",
  "Build a project management tool with Kanban boards...",
  "Create a blog with MDX, SEO, and a CMS dashboard...",
  "Build a REST API with JWT auth and Swagger docs...",
  "Generate a landing page with dark mode and animations...",
  "Set up a Postgres database with auth and migrations...",
  "Deploy a Next.js app to my cloud with CI/CD...",
  "Create a multi-tenant platform with role-based access...",
  "Build a portfolio site with blog and contact form...",
  "Design an admin panel with charts and data tables...",
  "or describe whatever you want to build...",
];

export function HeroSection() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showGitModal, setShowGitModal] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");

  // Rotating headline words
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  // Typewriter placeholder animation
  useEffect(() => {
    if (prompt) return; // Don't animate when user is typing

    const currentPrompt = placeholderPrompts[placeholderIndex];

    if (isTyping) {
      if (charIndex < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentPrompt.slice(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 28);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, pause then start erasing
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
        // Finished erasing, move to next prompt
        setPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, placeholderIndex, prompt]);

  const handleAttach = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileNames = Array.from(files).map((f) => f.name).join(", ");
      setPrompt((prev) => prev ? `${prev}\n\n📎 Attached: ${fileNames}` : `📎 Attached: ${fileNames}`);
    }
    e.target.value = "";
  }, []);

  const handleImportRepo = useCallback(() => {
    setShowGitModal(true);
  }, []);

  const handleRepoSubmit = useCallback(() => {
    if (repoUrl.trim()) {
      router.push(`/dashboard/ai-ide?repo=${encodeURIComponent(repoUrl.trim())}`);
    }
    setShowGitModal(false);
    setRepoUrl("");
  }, [repoUrl, router]);

  const handleBuild = useCallback(() => {
    if (prompt.trim()) {
      router.push(`/dashboard/ai-ide?prompt=${encodeURIComponent(prompt.trim())}`);
    } else {
      router.push("/dashboard");
    }
  }, [prompt, router]);

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[92vh] w-full overflow-hidden bg-app-bg pt-20 pb-16 px-4">
      {/* Atmospheric gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.12)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse,var(--app-accent-glow)_0%,transparent_60%)] blur-3xl opacity-80" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.10)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_70%)] blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Badge */}
        <motion.a
          href="#platform"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-app-border bg-app-card/60 backdrop-blur-sm text-base text-app-text-secondary mb-8 hover:border-app-accent/40 transition-colors"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          26 AI-powered engines, one platform
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </motion.a>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-app-text leading-[1.05] mb-6">
          The AI platform to
          <br />
          <span className="relative inline-flex justify-center min-w-[340px] sm:min-w-[520px] md:min-w-[600px] h-[1.25em] px-2">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                className="gradient-text absolute whitespace-nowrap"
                initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-app-text-secondary max-w-2xl mb-10 leading-relaxed">
          AI IDE, Visual UI Builder, Workflow Automation, Cloud Hosting, Database, and Domains — everything you need from idea to production, unified in one platform.
        </p>

        {/* AI Prompt Box — Bolt-style */}
        <motion.div
          className="w-full max-w-2xl rounded-2xl border border-app-border bg-app-card shadow-2xl shadow-black/10 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
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
                onClick={handleImportRepo}
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors shadow-lg shadow-app-accent-glow"
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
                    Import &amp; Open IDE
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick launch options */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-base text-app-text-muted mr-1">or start with</span>
          {[
            { label: "AI IDE", href: "/dashboard/ai-ide" },
            { label: "UI Builder", href: "/dashboard/builder" },
            { label: "Workflow", href: "/dashboard/workflows" },
            { label: "Database", href: "/dashboard" },
            { label: "Cloud Hosting", href: "/dashboard/cloud" },
            { label: "Domains", href: "/dashboard/domains" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-lg border border-app-border text-sm font-medium text-app-text-secondary hover:bg-app-card hover:border-app-accent/30 transition-all"
            >
              {item.label}
            </a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
