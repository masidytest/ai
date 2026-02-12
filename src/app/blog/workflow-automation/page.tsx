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
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent-text">Product</span>
            <span className="text-xs text-app-text-muted">Jan 28, 2026</span>
            <span className="text-xs text-app-text-muted">10 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-app-text mb-6 leading-tight">
            Workflow Automation: From Trigger to Production in Minutes
          </h1>

          <p className="text-app-text-secondary leading-relaxed mb-6">
            Every engineering team has repetitive processes: deploying on merge, sending Slack notifications on failure, syncing data between services, running nightly reports. These tasks are critical but tedious, and they are often implemented as brittle shell scripts or manual run-books. Masidy&apos;s Workflow Engine replaces all of that with a visual, node-based automation system that connects triggers to actions — and deploys instantly.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">How Workflows Work</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            A workflow in Masidy is a directed acyclic graph (DAG) of nodes. Each node is either a trigger (the event that starts the workflow) or an action (something the workflow does). You build workflows by dragging nodes onto a canvas and connecting them with edges.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            Triggers include: Git push, pull request opened, cron schedule, webhook received, database row inserted, manual button press, and file uploaded. Actions include: deploy to cloud, run a shell command, send an email, post to Slack, make an HTTP request, run a database query, transform data with JavaScript, wait/delay, and branch conditionally.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Example: Auto-Deploy on Merge</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Here is one of our most popular workflow templates. It triggers when a pull request is merged into the <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">main</code> branch and automatically deploys the application:
          </p>
          <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 mb-6 font-mono text-xs text-app-text-secondary overflow-x-auto">
            <pre>{`[Trigger: Git Push to main]
        ↓
[Action: Run Tests]
        ↓
[Condition: Tests Pass?]
    ├── Yes → [Action: Deploy to Production]
    │              ↓
    │         [Action: Post to Slack #deploys]
    │              ↓
    │         [Action: Tag Release in Git]
    └── No  → [Action: Post to Slack #alerts]
                   ↓
              [Action: Email Author]`}</pre>
          </div>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            This entire workflow takes about 90 seconds to build in the visual editor. The equivalent CI/CD configuration file — split across GitHub Actions YAML, a deployment script, and separate Slack integration code — would take an experienced engineer 2-3 hours to set up from scratch.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Example: Data Sync Pipeline</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Another common pattern is syncing data between systems. A workflow that copies new orders from your database to a Google Sheet for the sales team:
          </p>
          <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 mb-6 font-mono text-xs text-app-text-secondary overflow-x-auto">
            <pre>{`[Trigger: Database INSERT on orders table]
        ↓
[Action: Transform — extract customer, amount, date]
        ↓
[Action: HTTP POST to Google Sheets API]
        ↓
[Action: Send Email to sales@masidy.com]`}</pre>
          </div>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Built-In Reliability</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Workflow runs are durable. Every step execution is logged with input/output data, duration, and status. If an action fails (HTTP timeout, deployment error), the engine automatically retries with exponential backoff — up to three times by default, configurable per node.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            You can inspect any workflow run in detail: see exactly which nodes executed, what data flowed between them, and where a failure occurred. Failed runs can be retried manually from the point of failure without re-executing successful steps.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Performance at Scale</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            The Workflow Engine processes over 2 million executions per day across all Masidy customers. Median trigger-to-first-action latency is 120ms. Workflows run in isolated containers with 256MB memory and 0.5 vCPU by default, with the option to scale up for compute-heavy tasks.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-8">
            During our beta, ShopFlow migrated 47 GitHub Actions workflows to Masidy and reported a 73% reduction in CI/CD maintenance time. Their average deployment time dropped from 12 minutes (GitHub Actions build + deploy) to 87 seconds (Masidy trigger-to-live).
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Getting Started</h2>
          <p className="text-app-text-secondary leading-relaxed mb-8">
            Every Masidy account includes workflow automation. The free tier supports up to 1,000 workflow runs per month. Pro accounts get 50,000 runs, and Enterprise accounts get unlimited runs with dedicated execution infrastructure. Open the Workflow Builder from your dashboard to create your first automation in minutes.
          </p>

          <div className="mt-12 p-6 bg-app-card border border-app-border rounded-2xl text-center">
            <p className="text-app-text font-semibold mb-2">Automate your first workflow</p>
            <p className="text-app-text-muted text-sm mb-4">Build a deployment pipeline in under 2 minutes.</p>
            <Link href="/dashboard/workflows" className="inline-block px-6 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors">
              Open Workflow Builder
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-app-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center text-sm font-bold text-app-accent-text">RK</div>
            <div>
              <div className="font-semibold text-app-text text-sm">Rachel Kim, Product Manager</div>
              <div className="text-xs text-app-text-muted">rachel@masidy.com</div>
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
