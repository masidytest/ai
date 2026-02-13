"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const searchRoutes = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Projects", href: "/dashboard/projects" },
  { label: "Analytics", href: "/dashboard/analytics" },
  { label: "Deployments", href: "/dashboard/deployments" },
  { label: "Cloud", href: "/dashboard/cloud" },
  { label: "Hosting", href: "/dashboard/hosting" },
  { label: "Database", href: "/dashboard/database" },
  { label: "Domains", href: "/dashboard/domains" },
  { label: "Workflows", href: "/dashboard/workflows" },
  { label: "Builder", href: "/dashboard/builder" },
  { label: "AI IDE", href: "/dashboard/ai-ide" },
  { label: "Notifications", href: "/dashboard/notifications" },
  { label: "Billing", href: "/dashboard/billing" },
  { label: "Settings", href: "/dashboard/settings" },
  { label: "Documentation", href: "/docs" },
  { label: "Home", href: "/" },
];

const quickNotifs = [
  { id: 1, title: "Deployment successful", msg: "masidy-web v2.4.1", time: "5m", read: false },
  { id: 2, title: "High CPU alert", msg: "us-east-1 exceeded 90%", time: "12m", read: false },
  { id: 3, title: "New team member", msg: "jane@corp.com joined", time: "1h", read: true },
  { id: 4, title: "Invoice ready", msg: "February - $49.00", time: "3h", read: true },
];

function useBreadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const crumbs = [{ label: "Home", href: "/" }];
  let path = "";
  for (const p of parts) {
    path += `/${p}`;
    crumbs.push({ label: p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, " "), href: path });
  }
  return crumbs;
}

export function TopNavbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const crumbs = useBreadcrumb();

  const results = searchQ.trim()
    ? searchRoutes.filter((r) => r.label.toLowerCase().includes(searchQ.toLowerCase()))
    : searchRoutes.slice(0, 6);

  const unread = quickNotifs.filter((n) => !n.read).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-app-bg/80 backdrop-blur-md sticky top-0 z-20 border-b border-app-border"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-3">
        {/* Left: Project Selector */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-app-accent/10 text-app-accent-text font-semibold hover:bg-app-accent/15 transition-colors text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Project
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Center: Breadcrumbs (hidden on small mobile) */}
        <nav className="flex-1 hidden sm:flex justify-center">
          <ol className="flex gap-2 text-app-text-muted text-sm">
            {crumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-app-text-muted">/</span>}
                {i < crumbs.length - 1 ? (
                  <a href={c.href} className="hover:text-app-accent-text transition-colors">{c.label}</a>
                ) : (
                  <span className="text-app-accent-text font-medium">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Right: Search, Notifications, User */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              className="p-2 rounded-full hover:bg-app-accent/10 transition-colors text-app-text-secondary"
              onClick={() => { setShowSearch((v) => !v); setShowNotifs(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-72 max-w-sm bg-app-card border border-app-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-app-border">
                    <div className="relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <input
                        autoFocus
                        value={searchQ}
                        onChange={(e) => setSearchQ(e.target.value)}
                        placeholder="Search pages..."
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text text-sm placeholder:text-app-text-muted focus:outline-none focus:border-app-accent/50"
                      />
                    </div>
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {results.length > 0 ? results.map((r) => (
                      <button
                        key={r.href}
                        className="w-full px-4 py-2.5 text-left text-sm text-app-text-secondary hover:bg-app-accent/10 hover:text-app-text transition-colors flex items-center gap-2"
                        onClick={() => { router.push(r.href); setShowSearch(false); setSearchQ(""); }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M9 5l7 7-7 7"/></svg>
                        {r.label}
                      </button>
                    )) : (
                      <div className="px-4 py-6 text-center text-sm text-app-text-muted">No results found</div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              className="relative p-2 rounded-full hover:bg-app-accent/10 transition-colors text-app-text-secondary"
              onClick={() => { setShowNotifs((v) => !v); setShowSearch(false); }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              {unread > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-app-accent rounded-full border-2 border-app-bg" />
              )}
            </button>
            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-80 max-w-sm bg-app-card border border-app-border rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-app-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-app-text">Notifications</span>
                    {unread > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-app-accent/15 text-app-accent-text">{unread} new</span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {quickNotifs.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-app-border/50 hover:bg-app-accent/5 transition-colors cursor-pointer ${n.read ? "opacity-60" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-sm font-medium ${n.read ? "text-app-text-secondary" : "text-app-text"}`}>{n.title}</span>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-app-accent" />}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-app-text-muted">{n.msg}</span>
                          <span className="text-xs text-app-text-muted">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t border-app-border">
                    <button
                      className="w-full py-2 text-center text-sm text-app-accent-text hover:bg-app-accent/10 rounded-lg transition-colors font-medium"
                      onClick={() => { router.push("/dashboard/notifications"); setShowNotifs(false); }}
                    >
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User avatar */}
          <button
            className="w-8 h-8 rounded-full border-2 border-app-border overflow-hidden bg-app-card hover:border-app-accent/30 transition-colors"
            onClick={() => router.push("/dashboard/settings")}
          >
            <img src="https://api.dicebear.com/7.x/identicon/svg?seed=masidy" alt="User" className="w-full h-full" />
          </button>
        </div>
      </div>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-app-accent/20 to-transparent" />
    </motion.header>
  );
}
