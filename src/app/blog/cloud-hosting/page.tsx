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
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-app-text-muted hover:text-app-accent-text transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent-text">Infrastructure</span>
            <span className="text-xs text-app-text-muted">Jan 20, 2026</span>
            <span className="text-xs text-app-text-muted">9 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-app-text mb-6 leading-tight">
            Cloud Hosting Without the Complexity
          </h1>

          <p className="text-app-text-secondary leading-relaxed mb-6">
            Cloud hosting has a reputation problem. Services like AWS, GCP, and Azure are powerful but notoriously complex — even deploying a simple Node.js API can require configuring VPCs, security groups, load balancers, target groups, auto-scaling policies, and health checks. Masidy Cloud was built on a simple premise: deploying and scaling an application should take seconds, not hours.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Zero-Config Deployments</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            When you deploy an application on Masidy, you do not write configuration files. The platform detects your project type (Next.js, Express, Python, Go, static site) from your package.json or runtime files, provisions the appropriate container, installs dependencies, builds the project, and serves it on a globally distributed CDN — all in a single command or Git push.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            Every deployment is immutable and versioned. Rolling back to any previous version takes one click and completes in under 3 seconds. There is no downtime during deployments — we use blue-green switching to route traffic from the old version to the new one atomically.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Auto-Scaling</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Masidy Cloud scales your application automatically based on real-time traffic. Each deployment starts with a configurable baseline (1 instance for Starter plans, 3 for Pro, custom for Enterprise). When the platform detects sustained load above 70% CPU or 80% memory utilization, it spins up additional instances within 8 seconds. When traffic subsides, instances scale back down to avoid unnecessary costs.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            You can also configure scale-to-zero for staging environments and internal tools. When no requests arrive for 5 minutes, the application hibernates. The first request wakes it up with a cold start of approximately 1.2 seconds — fast enough for development and staging workflows, and a significant cost saver for low-traffic services.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Global Edge Network</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Every Masidy deployment is served through our global edge network spanning 42 points of presence across 6 continents. Static assets (JavaScript bundles, images, fonts) are cached at the edge with automatic cache invalidation on new deployments. API responses can be optionally cached with configurable TTLs using a simple response header.
          </p>
          <div className="bg-app-card border border-app-border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-app-border">
                <th className="text-left px-4 py-3 text-app-text-muted font-medium">Region</th>
                <th className="text-left px-4 py-3 text-app-text-muted font-medium">PoPs</th>
                <th className="text-left px-4 py-3 text-app-text-muted font-medium">Avg Latency</th>
              </tr></thead>
              <tbody className="text-app-text-secondary">
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">North America</td><td className="px-4 py-2.5">14</td><td className="px-4 py-2.5">18ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Europe</td><td className="px-4 py-2.5">12</td><td className="px-4 py-2.5">22ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Asia Pacific</td><td className="px-4 py-2.5">10</td><td className="px-4 py-2.5">35ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">South America</td><td className="px-4 py-2.5">3</td><td className="px-4 py-2.5">45ms</td></tr>
                <tr><td className="px-4 py-2.5">Africa &amp; Middle East</td><td className="px-4 py-2.5">3</td><td className="px-4 py-2.5">52ms</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Preview Deployments</h2>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            Every Git branch and pull request automatically receives its own preview deployment with a unique URL. Your team can test changes in a production-identical environment before merging. Preview URLs follow the pattern <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">branch-name.project.masidy.app</code>. When the branch is deleted, the preview deployment is automatically cleaned up.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">SSL and Custom Domains</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Every deployment gets automatic HTTPS via Let&apos;s Encrypt. Adding a custom domain takes 30 seconds: add the domain in your project settings, point your DNS to our provided CNAME or A record, and Masidy provisions and renews the SSL certificate automatically. Wildcard certificates are supported for Enterprise plans.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Cost Transparency</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            One of our core design principles is that you should never receive a surprise bill. The Starter plan includes $0/month for one project with 100GB bandwidth. Pro includes $48/month for 10 projects with 1TB bandwidth and auto-scaling. Every resource has a hard spending cap that you set — when the cap is reached, we alert you and optionally pause scaling rather than accruing overages.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-8">
            Your billing dashboard shows real-time resource usage with projected costs, broken down by project, region, and resource type (compute, bandwidth, storage). No hidden fees, no arcane pricing calculators.
          </p>

          <div className="mt-12 p-6 bg-app-card border border-app-border rounded-2xl text-center">
            <p className="text-app-text font-semibold mb-2">Deploy your first project</p>
            <p className="text-app-text-muted text-sm mb-4">Push your code and watch it go live in seconds.</p>
            <Link href="/dashboard/cloud" className="inline-block px-6 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors">
              Open Cloud Dashboard
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-app-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center text-sm font-bold text-app-accent-text">JP</div>
            <div>
              <div className="font-semibold text-app-text text-sm">Jordan Patel, Infrastructure Lead</div>
              <div className="text-xs text-app-text-muted">jordan@masidy.com</div>
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
