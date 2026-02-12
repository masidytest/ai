"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function RestApiDocs() {
  return (
    <DocsLayout title="REST API" description="Authenticate and interact with the Masidy platform API." currentPath="/docs/rest-api">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Base URL</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>https://api.masidy.com/v1</pre>
        </div>
        <p>All endpoints return JSON. Requests must include an <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">Authorization</code> header with a valid API key.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Authentication</h2>
        <p>Generate an API key from the dashboard under Settings → API Keys. Include it in every request:</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`curl -H "Authorization: Bearer msk_live_abc123..." \\
     https://api.masidy.com/v1/projects`}</pre>
        </div>
        <p>API keys have configurable scopes: <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">projects:read</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">projects:write</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">deployments:write</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">databases:read</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">domains:write</code>, <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">billing:read</code>.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Endpoints</h2>

        <h3 className="text-lg font-medium text-app-text mt-4">Projects</h3>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Method</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Path</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Description</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-green-400">GET</td><td className="px-4 py-2 font-mono">/projects</td><td className="px-4 py-2">List all projects</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-green-400">GET</td><td className="px-4 py-2 font-mono">/projects/:id</td><td className="px-4 py-2">Get project details</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-blue-400">POST</td><td className="px-4 py-2 font-mono">/projects</td><td className="px-4 py-2">Create a new project</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-yellow-400">PATCH</td><td className="px-4 py-2 font-mono">/projects/:id</td><td className="px-4 py-2">Update project settings</td></tr>
              <tr><td className="px-4 py-2 font-mono text-red-400">DELETE</td><td className="px-4 py-2 font-mono">/projects/:id</td><td className="px-4 py-2">Delete a project</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-app-text mt-4">Deployments</h3>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Method</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Path</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Description</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-green-400">GET</td><td className="px-4 py-2 font-mono">/projects/:id/deployments</td><td className="px-4 py-2">List deployments</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-blue-400">POST</td><td className="px-4 py-2 font-mono">/projects/:id/deploy</td><td className="px-4 py-2">Trigger a deployment</td></tr>
              <tr><td className="px-4 py-2 font-mono text-blue-400">POST</td><td className="px-4 py-2 font-mono">/deployments/:id/rollback</td><td className="px-4 py-2">Rollback to this version</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-medium text-app-text mt-4">Databases</h3>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Method</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Path</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Description</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-green-400">GET</td><td className="px-4 py-2 font-mono">/databases</td><td className="px-4 py-2">List databases</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-blue-400">POST</td><td className="px-4 py-2 font-mono">/databases</td><td className="px-4 py-2">Create a database</td></tr>
              <tr><td className="px-4 py-2 font-mono text-red-400">DELETE</td><td className="px-4 py-2 font-mono">/databases/:id</td><td className="px-4 py-2">Delete a database</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Request &amp; Response Format</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`// Create a project
POST /v1/projects
Content-Type: application/json

{
  "name": "my-app",
  "framework": "nextjs",
  "region": "us-east-1"
}

// Response (201 Created)
{
  "id": "proj_a1b2c3d4",
  "name": "my-app",
  "framework": "nextjs",
  "region": "us-east-1",
  "status": "active",
  "createdAt": "2025-01-15T10:30:00Z",
  "url": "https://my-app.masidy.app"
}`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Rate Limits</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Plan</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Requests / min</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Burst</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Starter</td><td className="px-4 py-2">60</td><td className="px-4 py-2">10</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Pro</td><td className="px-4 py-2">600</td><td className="px-4 py-2">50</td></tr>
              <tr><td className="px-4 py-2">Enterprise</td><td className="px-4 py-2">6,000</td><td className="px-4 py-2">200</td></tr>
            </tbody>
          </table>
        </div>
        <p>Rate-limited responses return <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">429 Too Many Requests</code> with a <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">Retry-After</code> header.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Error Codes</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Code</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Meaning</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">400</td><td className="px-4 py-2">Bad request — invalid parameters</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">401</td><td className="px-4 py-2">Unauthorized — missing or invalid API key</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">403</td><td className="px-4 py-2">Forbidden — insufficient scopes</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">404</td><td className="px-4 py-2">Not found — resource does not exist</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">429</td><td className="px-4 py-2">Rate limited — slow down requests</td></tr>
              <tr><td className="px-4 py-2">500</td><td className="px-4 py-2">Server error — retry with backoff</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/webhooks" className="text-app-accent-text hover:underline">Webhooks</Link> — Receive event notifications. <Link href="/docs/sdks" className="text-app-accent-text hover:underline">SDKs</Link> — Client libraries for Node.js, Python, and Go.</p>
      </section>
    </DocsLayout>
  );
}
