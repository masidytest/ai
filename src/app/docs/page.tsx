"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../components/Footer";

const sections = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", desc: "Learn what Masidy is and how it works.", href: "/docs/introduction" },
      { label: "Quick Start", desc: "Create your first project in under 5 minutes.", href: "/docs/quick-start" },
      { label: "Installation", desc: "Set up the CLI and connect your account.", href: "/docs/installation" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "AI IDE", desc: "Code with AI-powered suggestions and refactoring.", href: "/docs/ai-ide" },
      { label: "UI Builder", desc: "Drag-and-drop visual interface builder.", href: "/docs/ui-builder" },
      { label: "Workflow Automation", desc: "Build and deploy automated workflows.", href: "/docs/workflow-automation" },
      { label: "Cloud Hosting", desc: "Deploy apps with zero-config scaling.", href: "/docs/cloud-hosting" },
      { label: "Database", desc: "Managed databases with schema explorer.", href: "/docs/database" },
      { label: "Domains", desc: "Register, manage DNS, and configure SSL.", href: "/docs/domains" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { label: "REST API", desc: "Full reference for the Masidy REST API.", href: "/docs/rest-api" },
      { label: "Webhooks", desc: "Real-time event notifications.", href: "/docs/webhooks" },
      { label: "SDKs", desc: "Client libraries for Node.js, Python, and Go.", href: "/docs/sdks" },
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <main className="min-h-screen bg-app-bg px-4 pt-24 pb-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-app-text mb-3">Documentation</h1>
          <p className="text-app-text-secondary mb-12">Everything you need to build, deploy, and scale with Masidy.</p>

          {sections.map((section, si) => (
            <div key={section.title} className="mb-12">
              <motion.h2
                className="text-xl font-semibold text-app-text mb-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: si * 0.1 }}
              >
                {section.title}
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.items.map((item, ii) => (
                  <Link key={item.label} href={item.href}>
                    <motion.div
                      className="bg-app-card border border-app-border rounded-2xl p-5 hover:border-app-accent/30 hover:shadow-lg transition-all cursor-pointer group h-full"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.1 + ii * 0.05 }}
                      whileHover={{ y: -4 }}
                    >
                      <h3 className="text-sm font-semibold text-app-text mb-1 group-hover:text-app-accent-text transition-colors">{item.label}</h3>
                      <p className="text-xs text-app-text-muted leading-relaxed">{item.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-8 p-6 bg-app-card border border-app-border rounded-2xl text-center">
            <p className="text-app-text-secondary text-sm mb-3">Can&apos;t find what you need?</p>
            <Link
              href="/contact"
              className="px-6 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors inline-block"
            >
              Contact Support
            </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
