"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Blog", href: "/blog" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isDark = theme === "dark";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-app-bg/80 backdrop-blur-xl border-b border-app-border navbar-scrolled"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3 group">
          <motion.div
            className="relative w-10 h-10"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {/* Spinning outer glow ring */}
            <motion.div
              className="absolute -inset-[3px] rounded-2xl opacity-60 blur-[2px]"
              style={{ background: "conic-gradient(from 0deg, #818cf8, #a855f7, #22d3ee, #818cf8)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            {/* Icon container */}
            <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
              <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                {/* Hexagon shield */}
                <path d="M16 2L28 9v14l-12 7L4 23V9l12-7z" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="1.2" />
                {/* M letterform */}
                <path d="M10 22V12l6 6 6-6v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                {/* Spark */}
                <motion.circle cx="16" cy="9" r="1.8" fill="white" animate={{ opacity: [0.5, 1, 0.5], r: [1.5, 2.2, 1.5] }} transition={{ duration: 2, repeat: Infinity }} />
              </svg>
              {/* Glass overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
            </div>
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="text-[22px] font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-300 dark:via-purple-200 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              Masidy
            </span>
            <span className="text-[8px] font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mt-0.5">
              dev platform
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-sm text-app-text-secondary hover:text-app-text transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-2">
          {mounted && (
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-app-text-muted hover:text-app-text hover:bg-app-surface transition-colors"
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          )}
          <a href="/login" className="px-3 py-2 text-sm text-app-text-secondary hover:text-app-text transition-colors">
            Sign in
          </a>
          <a
            href="/dashboard"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-app-btn-primary text-app-btn-primary-text hover:bg-app-btn-primary-hover transition-colors"
          >
            Get started
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          {mounted && (
            <button
              aria-label="Toggle theme"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-app-text-muted hover:text-app-text transition-colors"
            >
              {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>
          )}
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-app-text-muted hover:text-app-text transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-app-bg border-b border-app-border px-4 pb-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm text-app-text-secondary hover:text-app-text transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-3 border-t border-app-border mt-2">
            <a href="/login" className="flex-1 text-center py-2 text-sm text-app-text-secondary">Sign in</a>
            <a href="/dashboard" className="flex-1 text-center py-2 rounded-lg text-sm font-medium bg-app-btn-primary text-app-btn-primary-text">Get started</a>
          </div>
        </div>
      )}
    </nav>
  );
}
