"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../components/Footer";

const sidebar = [
  { group: "Getting Started", items: [
    { label: "Introduction", href: "/docs/introduction" },
    { label: "Quick Start", href: "/docs/quick-start" },
    { label: "Installation", href: "/docs/installation" },
  ]},
  { group: "Platform", items: [
    { label: "AI IDE", href: "/docs/ai-ide" },
    { label: "UI Builder", href: "/docs/ui-builder" },
    { label: "Workflow Automation", href: "/docs/workflow-automation" },
    { label: "Cloud Hosting", href: "/docs/cloud-hosting" },
    { label: "Database", href: "/docs/database" },
    { label: "Domains", href: "/docs/domains" },
  ]},
  { group: "API Reference", items: [
    { label: "REST API", href: "/docs/rest-api" },
    { label: "Webhooks", href: "/docs/webhooks" },
    { label: "SDKs", href: "/docs/sdks" },
  ]},
];

export function DocsLayout({ children, title, description, currentPath }: { children: ReactNode; title: string; description: string; currentPath: string }) {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <div className="flex pt-16">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-app-border bg-app-bg-secondary/50 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-4">
          {sidebar.map((group) => (
            <div key={group.group} className="mb-6">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-app-text-muted mb-2 px-3">{group.group}</div>
              <nav className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                      currentPath === item.href
                        ? "bg-app-accent/10 text-app-accent-text font-medium"
                        : "text-app-text-secondary hover:text-app-text hover:bg-app-accent/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 px-4 lg:px-12 py-12 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {/* Mobile nav */}
            <div className="lg:hidden mb-8">
              <Link href="/docs" className="inline-flex items-center gap-2 text-sm text-app-text-muted hover:text-app-accent-text transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                All Docs
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-app-text mb-3">{title}</h1>
            <p className="text-app-text-muted mb-8 text-lg">{description}</p>
            <div className="prose-custom">{children}</div>

            {/* Prev/Next */}
            <div className="mt-16 pt-8 border-t border-app-border">
              <p className="text-xs text-app-text-muted mb-4">Need help? Contact us at <a href="mailto:support@masidy.com" className="text-app-accent-text hover:underline">support@masidy.com</a></p>
            </div>
          </motion.div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
