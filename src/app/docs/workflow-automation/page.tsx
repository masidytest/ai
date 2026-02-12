"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function WorkflowAutomationDocs() {
  return (
    <DocsLayout title="Workflow Automation" description="Build and deploy automated workflows." currentPath="/docs/workflow-automation">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>The Workflow Engine lets you automate repetitive tasks by connecting triggers to actions in a visual, node-based editor. Workflows are directed acyclic graphs (DAGs) that execute reliably with built-in retry logic, logging, and monitoring.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Triggers</h2>
        <p>A trigger is the event that starts a workflow run. Masidy supports:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">Git Push</strong> — Runs when code is pushed to a specified branch</li>
          <li><strong className="text-app-text">Pull Request</strong> — Runs when a PR is opened, merged, or closed</li>
          <li><strong className="text-app-text">Cron Schedule</strong> — Runs on a recurring schedule (e.g., every hour, daily at 2AM UTC)</li>
          <li><strong className="text-app-text">Webhook</strong> — Runs when an external HTTP request hits the workflow endpoint</li>
          <li><strong className="text-app-text">Database Event</strong> — Runs when a row is inserted, updated, or deleted</li>
          <li><strong className="text-app-text">Manual</strong> — Runs when you click the Run button in the dashboard</li>
          <li><strong className="text-app-text">File Upload</strong> — Runs when a file is uploaded to project storage</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Actions</h2>
        <p>Actions are the steps your workflow performs after the trigger fires:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">Deploy</strong> — Deploy to production or create a preview deployment</li>
          <li><strong className="text-app-text">Run Command</strong> — Execute a shell command (tests, builds, scripts)</li>
          <li><strong className="text-app-text">Send Email</strong> — Send an email notification to any address</li>
          <li><strong className="text-app-text">Slack Message</strong> — Post to a Slack channel or DM</li>
          <li><strong className="text-app-text">HTTP Request</strong> — Make GET, POST, PUT, DELETE requests to any URL</li>
          <li><strong className="text-app-text">Database Query</strong> — Run SQL queries against your project database</li>
          <li><strong className="text-app-text">Transform</strong> — Process data with JavaScript (map, filter, aggregate)</li>
          <li><strong className="text-app-text">Condition</strong> — Branch execution based on a boolean expression</li>
          <li><strong className="text-app-text">Wait/Delay</strong> — Pause execution for a specified duration</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Building a Workflow</h2>
        <p>Open the Workflow Builder from your project dashboard. Drag a trigger node onto the canvas, then connect action nodes by clicking output ports and dragging to input ports. Each node displays a configuration panel when selected where you set parameters (branch name, command string, email address, etc.).</p>
        <p>Workflows execute top-to-bottom. When a condition node is reached, the workflow branches: one path for true, another for false. Parallel branches execute simultaneously; the workflow continues past a join point only when all parallel branches complete.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Error Handling</h2>
        <p>Each action node has configurable retry settings: number of retries (default 3), backoff strategy (exponential or fixed), and timeout. If all retries fail, you can configure a fallback action — commonly a Slack notification or email alert.</p>
        <p>Every workflow run is logged with full input/output data for each step. You can inspect failed runs, identify the failure point, and re-run from that step without re-executing earlier steps.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Limits</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Plan</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Runs/Month</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Max Nodes</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Timeout</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Starter</td><td className="px-4 py-2">1,000</td><td className="px-4 py-2">20</td><td className="px-4 py-2">5 min</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Pro</td><td className="px-4 py-2">50,000</td><td className="px-4 py-2">100</td><td className="px-4 py-2">30 min</td></tr>
              <tr><td className="px-4 py-2">Enterprise</td><td className="px-4 py-2">Unlimited</td><td className="px-4 py-2">Unlimited</td><td className="px-4 py-2">Configurable</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/cloud-hosting" className="text-app-accent-text hover:underline">Cloud Hosting</Link> — Deploy actions route to this service. <Link href="/docs/webhooks" className="text-app-accent-text hover:underline">Webhooks</Link> — Trigger workflows from external services.</p>
      </section>
    </DocsLayout>
  );
}
