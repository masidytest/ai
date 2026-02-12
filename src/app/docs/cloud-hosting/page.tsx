"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function CloudHostingDocs() {
  return (
    <DocsLayout title="Cloud Hosting" description="Deploy apps with zero-config scaling." currentPath="/docs/cloud-hosting">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>Masidy Cloud Hosting deploys your application to a globally distributed infrastructure with automatic scaling, SSL, CDN caching, and blue-green deployments. You push code and the platform handles everything else.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Supported Runtimes</h2>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Node.js (16, 18, 20, 22)</li>
          <li>Python (3.10, 3.11, 3.12)</li>
          <li>Go (1.21, 1.22)</li>
          <li>Rust (latest stable)</li>
          <li>Static Sites (HTML, CSS, JS)</li>
          <li>Docker containers (custom Dockerfile)</li>
        </ul>
        <p>The platform auto-detects your runtime from <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">package.json</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">requirements.txt</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">go.mod</code>, or <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">Dockerfile</code>.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Deployment Methods</h2>
        <p><strong className="text-app-text">Git Push:</strong> Connect a GitHub, GitLab, or Bitbucket repository. Every push to the configured branch triggers an automatic deployment. Pull requests get preview deployments.</p>
        <p><strong className="text-app-text">CLI:</strong> Run <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">masidy deploy</code> from your project directory. The CLI uploads your code, builds the project, and deploys it.</p>
        <p><strong className="text-app-text">Dashboard:</strong> Click the Deploy button in the project&apos;s Cloud panel. Select the branch and environment (production, staging, preview).</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Environment Variables</h2>
        <p>Set environment variables from the dashboard or CLI. Variables are encrypted at rest and injected at build time and runtime. You can define variables per environment (production, staging, development).</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Set a variable
masidy env set DATABASE_URL=postgres://user:pass@host:5432/db

# Set for staging only
masidy env set --env staging DATABASE_URL=postgres://...

# List all variables
masidy env list`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Scaling</h2>
        <p>Auto-scaling is enabled by default. The platform monitors CPU and memory utilization and adds or removes instances as needed. You can configure minimum and maximum instance counts and the scaling threshold.</p>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Plan</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Instances</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">vCPU</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">RAM</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Bandwidth</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Starter</td><td className="px-4 py-2">1</td><td className="px-4 py-2">0.5</td><td className="px-4 py-2">512 MB</td><td className="px-4 py-2">100 GB</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Pro</td><td className="px-4 py-2">1–10</td><td className="px-4 py-2">2</td><td className="px-4 py-2">4 GB</td><td className="px-4 py-2">1 TB</td></tr>
              <tr><td className="px-4 py-2">Enterprise</td><td className="px-4 py-2">Custom</td><td className="px-4 py-2">Custom</td><td className="px-4 py-2">Custom</td><td className="px-4 py-2">Custom</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Rollbacks</h2>
        <p>Every deployment is versioned. To roll back, open the Deployments tab, find the previous version, and click Rollback. The operation completes in under 3 seconds with zero downtime using blue-green switching.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/domains" className="text-app-accent-text hover:underline">Domains</Link> — Connect custom domains. <Link href="/docs/workflow-automation" className="text-app-accent-text hover:underline">Workflow Automation</Link> — Automate deployments.</p>
      </section>
    </DocsLayout>
  );
}
