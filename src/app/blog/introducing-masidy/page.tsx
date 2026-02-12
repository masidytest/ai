"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../../components/Footer";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <main className="px-4 pt-24 pb-20">
        <motion.article
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-app-text-muted hover:text-app-accent-text transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent-text">Announcement</span>
            <span className="text-xs text-app-text-muted">Feb 10, 2026</span>
            <span className="text-xs text-app-text-muted">8 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-app-text mb-6 leading-tight">
            Introducing Masidy: The All-in-One AI Dev Platform
          </h1>

          <p className="text-app-text-secondary leading-relaxed mb-6">
            Today we are launching Masidy — a unified platform that brings together 26 AI-powered engines so developers and teams can build, deploy, and scale applications from a single workspace. No more juggling between a hosting provider, a separate database service, a CI/CD pipeline, a domain registrar, and a half-dozen SaaS tools just to ship a feature. Masidy consolidates all of that into one coherent experience.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Why We Built Masidy</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Modern development stacks are fragmented. A typical startup maintains accounts with at least five different cloud services, each with its own billing, dashboard, and learning curve. We surveyed 400 engineering teams and found that the average developer spends 35% of their time on infrastructure and tooling glue code rather than writing product logic.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            Masidy was designed to collapse that stack. Our AI IDE writes and refactors code with full project context. The UI Builder lets designers ship production-ready pages without writing CSS. The Workflow Engine automates everything from deployment pipelines to Slack notifications. Cloud Hosting handles scaling, SSL, and CDN edge caching automatically. And the Database service provisions managed PostgreSQL, MySQL, or MongoDB instances with one click, complete with a built-in schema explorer and migration runner.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">What&apos;s Included</h2>
          <ul className="space-y-3 mb-6">
            {[
              ["AI IDE", "Intelligent code editor with multi-file context, inline suggestions, one-click refactoring, and a live preview panel that renders your frontend in real-time."],
              ["Visual UI Builder", "Drag-and-drop interface for building responsive layouts. Supports custom components, Tailwind class editing, and direct export to your codebase."],
              ["Workflow Automation", "Node-based workflow engine with 40+ built-in triggers (Git push, cron, webhook, database change) and actions (deploy, email, Slack, HTTP request)."],
              ["Cloud Hosting", "Zero-config deployments with auto-scaling, instant rollbacks, preview deployments for every branch, and a global CDN with edge caching."],
              ["Managed Databases", "Provision PostgreSQL, MySQL, or MongoDB clusters. Includes a SQL console, schema browser, automatic daily backups, and point-in-time recovery."],
              ["Domain Management", "Register new domains or connect existing ones. Automatic DNS configuration, free wildcard SSL via Let's Encrypt, and WHOIS privacy protection."],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-app-text-secondary text-sm leading-relaxed"><strong className="text-app-text">{title}:</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Early Results</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            During our closed beta with 200 teams over the past six months, we measured an average 58% reduction in time-to-deployment and a 42% decrease in infrastructure costs. Teams that previously needed dedicated DevOps engineers were able to self-serve their entire deployment pipeline through Masidy&apos;s Workflow Engine and Cloud Hosting.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            NovaPay, a fintech startup with 12 engineers, shipped their entire payment dashboard in three weeks using Masidy — a project their CTO estimated would have taken three months with their previous toolchain. HealthSync, a healthcare platform, used the AI IDE and workflow automation to build HIPAA-compliant features without hiring compliance specialists.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Pricing</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Masidy offers a generous free tier that includes one project, community support, and basic analytics — enough to build and deploy a production application at no cost. The Pro plan at $49/month unlocks 10 projects, priority support, advanced analytics, and higher resource limits. Enterprise pricing is custom and includes unlimited projects, dedicated support, SSO, audit logs, and SLA guarantees.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">What&apos;s Next</h2>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            This launch is just the beginning. Over the next quarter, we are shipping a real-time collaboration mode for the AI IDE, a marketplace for community-built workflow templates, native mobile app deployment support, and deeper integrations with GitHub, GitLab, Jira, and Linear. We are also expanding our infrastructure to three new regions: South America, Middle East, and Southeast Asia.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-8">
            We built Masidy because we believe developers deserve better tools — tools that work together, not against each other. If you have spent too many hours configuring infrastructure instead of building your product, we built this for you.
          </p>

          {/* CTA */}
          <div className="mt-12 p-6 bg-app-card border border-app-border rounded-2xl text-center">
            <p className="text-app-text font-semibold mb-2">Ready to try Masidy?</p>
            <p className="text-app-text-muted text-sm mb-4">Start building for free. No credit card required.</p>
            <Link href="/signup" className="inline-block px-6 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Author */}
          <div className="mt-10 pt-8 border-t border-app-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center text-sm font-bold text-app-accent-text">MK</div>
            <div>
              <div className="font-semibold text-app-text text-sm">Masidy Team</div>
              <div className="text-xs text-app-text-muted">team@masidy.com</div>
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
