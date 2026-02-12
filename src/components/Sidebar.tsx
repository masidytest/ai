"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ResizeHandle, useResizable } from "./ui/ResizablePanel";

const menu = [
  { label: "Dashboard", href: "/dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { label: "Projects", href: "/dashboard/projects", icon: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" },
  { label: "Analytics", href: "/dashboard/analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { label: "Deployments", href: "/dashboard/deployments", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
  { label: "Cloud", href: "/dashboard/cloud", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { label: "Hosting", href: "/dashboard/hosting", icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" },
  { label: "Database", href: "/dashboard/database", icon: "M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4M4 12c0 2.21 3.58 4 8 4s8-1.79 8-4" },
  { label: "Domains", href: "/dashboard/domains", icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9" },
  { label: "Workflows", href: "/dashboard/workflows", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { label: "Builder", href: "/dashboard/builder", icon: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" },
  { label: "AI IDE", href: "/dashboard/ai-ide", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" },
  { label: "Billing", href: "/dashboard/billing", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  { label: "Settings", href: "/dashboard/settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

const dividerAfter = [3, 7, 10];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const router = useRouter();
  const sidebarR = useResizable({ initial: 220, min: 160, max: 360, storageKey: "sidebar-width" });

  const currentWidth = collapsed ? 64 : sidebarR.size;

  return (
    <div className="h-full flex shrink-0">
    <motion.aside
      animate={{ width: currentWidth }}
      className="h-full bg-app-bg-secondary border-r border-app-border flex flex-col py-6 px-2 transition-all duration-300 relative overflow-hidden"
    >
      {/* Collapse toggle */}
      <button
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-app-btn-primary text-app-btn-primary-text flex items-center justify-center shadow-md hover:bg-app-btn-primary-hover transition-colors z-10"
        onClick={() => setCollapsed((v) => !v)}
        aria-label="Toggle sidebar"
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </motion.span>
      </button>

      <nav className="flex flex-col gap-1 mt-8 flex-1 overflow-y-auto">
        {menu.map((item, i) => (
          <div key={item.label}>
            <motion.button
              className={`flex items-center w-full rounded-lg px-3 py-2.5 gap-3 text-left font-medium transition-all duration-200 focus:outline-none ${
                active === item.label
                  ? "bg-app-accent/10 text-app-accent-text shadow-sm"
                  : "hover:bg-app-accent/5 text-app-text-secondary hover:text-app-text"
              } ${collapsed ? "justify-center px-0" : ""}`}
              onClick={() => {
                setActive(item.label);
                router.push(item.href);
              }}
              whileHover={{ x: collapsed ? 0 : 3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d={item.icon} />
              </svg>
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </motion.button>
            {dividerAfter.includes(i) && (
              <div className="my-3 h-px w-full bg-app-border" />
            )}
          </div>
        ))}
      </nav>

      {/* Back to Home */}
      <div className="pt-4 border-t border-app-border mt-4">
        <motion.button
          className={`flex items-center w-full rounded-lg px-3 py-2.5 gap-3 text-left font-medium text-app-text-muted hover:text-app-text hover:bg-app-accent/5 transition-all duration-200 focus:outline-none ${collapsed ? "justify-center px-0" : ""}`}
          onClick={() => router.push("/")}
          whileHover={{ x: collapsed ? 0 : 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {!collapsed && <span className="text-sm">Back to Home</span>}
        </motion.button>
      </div>
    </motion.aside>
    {!collapsed && <ResizeHandle direction="horizontal" onResize={sidebarR.handleResize} />}
    </div>
  );
}
