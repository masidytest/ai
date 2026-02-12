"use client";

import { motion } from "framer-motion";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "AI IDE", href: "/dashboard/ai-ide" },
      { label: "UI Builder", href: "/dashboard/builder" },
      { label: "Workflow Automation", href: "/dashboard/workflows" },
      { label: "Cloud Hosting", href: "/dashboard/cloud" },
      { label: "Database", href: "/dashboard/database" },
      { label: "Domains", href: "/dashboard/domains" },
    ],
  },
  {
    title: "Developer",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api-reference" },
      { label: "Templates", href: "/templates" },
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Guides", href: "/guides" },
      { label: "Community", href: "/community" },
      { label: "Case Studies", href: "/case-studies" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Security", href: "/security" },
      { label: "Contact", href: "/contact" },
      { label: "Legal", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="w-full bg-app-bg-secondary border-t border-app-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            className="col-span-2 md:col-span-1"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="/" className="flex items-center gap-3 mb-5 group">
              <motion.div
                className="relative w-11 h-11"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  className="absolute -inset-[3px] rounded-2xl opacity-50 blur-[2px]"
                  style={{ background: "conic-gradient(from 0deg, #818cf8, #a855f7, #22d3ee, #818cf8)" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                    <path d="M16 2L28 9v14l-12 7L4 23V9l12-7z" fill="white" fillOpacity="0.12" stroke="white" strokeWidth="1.2" />
                    <path d="M10 22V12l6 6 6-6v10" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="16" cy="9" r="1.8" fill="white" opacity="0.85" />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/15 to-transparent" />
                </div>
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 dark:from-indigo-300 dark:via-purple-200 dark:to-cyan-300 bg-clip-text text-transparent">
                  Masidy
                </span>
                <span className="text-[9px] font-bold tracking-[0.3em] uppercase bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent mt-0.5">
                  dev platform
                </span>
              </div>
            </a>
            <p className="text-sm text-app-text-muted leading-relaxed mb-4">
              The AI-powered platform to build, launch, and scale full-stack applications. Replaces your entire dev stack.
            </p>
            <div className="flex gap-3">
              {[
                { label: "Twitter", href: "https://twitter.com/masidy", d: "M4 4l11.73 16h4.27L8.27 4H4zM4 20l6.77-9.23M13.23 13.23L20 4" },
                { label: "GitHub", href: "https://github.com/masidy", d: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" },
                { label: "LinkedIn", href: "https://linkedin.com/company/masidy", d: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 8.5h.01M7.5 16v-5M7.5 8h.01M10 16v-3.5a2.5 2.5 0 015 0V16" },
              ].map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-app-text-muted hover:text-app-text transition-colors"
                  aria-label={s.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d={s.d}/></svg>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns with stagger */}
          {columns.map((col, ci) => (
            <motion.div
              key={col.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 * (ci + 1) }}
            >
              <h4 className="text-sm font-semibold text-app-text mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link, li) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.08 * (ci + 1) + 0.03 * li }}
                  >
                    <a
                      href={link.href}
                      className="text-sm text-app-text-muted hover:text-app-accent-text transition-colors inline-block"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-app-border"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="text-xs text-app-text-muted">
            &copy; {new Date().getFullYear()} Masidy, Inc. All rights reserved.
          </span>
          <div className="flex gap-6">
            {[
              { label: "Security", href: "/security" },
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Cookie Preferences", href: "/privacy" },
            ].map((t) => (
              <a key={t.label} href={t.href} className="text-xs text-app-text-muted hover:text-app-text transition-colors">
                {t.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
