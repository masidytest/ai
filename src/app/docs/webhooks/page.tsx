"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function WebhooksDocs() {
  return (
    <DocsLayout title="Webhooks" description="Receive real-time event notifications via HTTP." currentPath="/docs/webhooks">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>Masidy Webhooks deliver real-time HTTP POST notifications to your endpoint whenever events occur on the platform. Use webhooks to trigger external workflows, sync data, send notifications, or integrate with third-party services.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Creating a Webhook</h2>
        <p>Navigate to Settings → Webhooks in the dashboard. Click Add Endpoint and provide:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">URL</strong> — The HTTPS endpoint that will receive events.</li>
          <li><strong className="text-app-text">Events</strong> — Select which event types to subscribe to.</li>
          <li><strong className="text-app-text">Secret</strong> — An auto-generated signing secret for verifying payloads.</li>
        </ul>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Create a webhook via CLI
masidy webhook create \\
  --url https://example.com/hooks/masidy \\
  --events deployment.created,deployment.succeeded \\
  --secret whsec_abc123`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Event Types</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Event</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Fires When</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">deployment.created</td><td className="px-4 py-2">A deployment is initiated</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">deployment.succeeded</td><td className="px-4 py-2">A deployment finishes successfully</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">deployment.failed</td><td className="px-4 py-2">A deployment fails</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">project.created</td><td className="px-4 py-2">A new project is created</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">project.deleted</td><td className="px-4 py-2">A project is deleted</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">domain.verified</td><td className="px-4 py-2">A custom domain passes verification</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">database.created</td><td className="px-4 py-2">A database instance is provisioned</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2 font-mono">workflow.completed</td><td className="px-4 py-2">A workflow execution finishes</td></tr>
              <tr><td className="px-4 py-2 font-mono">workflow.failed</td><td className="px-4 py-2">A workflow execution fails</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Payload Format</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`POST /hooks/masidy HTTP/1.1
Content-Type: application/json
X-Masidy-Signature: sha256=abc123...
X-Masidy-Event: deployment.succeeded
X-Masidy-Delivery: evt_d1e2f3

{
  "id": "evt_d1e2f3",
  "type": "deployment.succeeded",
  "createdAt": "2025-01-15T10:30:00Z",
  "data": {
    "deploymentId": "dpl_x1y2z3",
    "projectId": "proj_a1b2c3",
    "environment": "production",
    "url": "https://my-app.masidy.app",
    "duration": 34200,
    "commit": "a1b2c3d"
  }
}`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Signature Verification</h2>
        <p>Every webhook delivery is signed with your endpoint&apos;s secret using HMAC-SHA256. Always verify the signature before processing the payload.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`import crypto from "crypto";

function verifyWebhook(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from("sha256=" + expected)
  );
}`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Retry Policy</h2>
        <p>If your endpoint returns a non-2xx status code or times out (10 seconds), Masidy retries the delivery with exponential backoff:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Retry 1: 30 seconds</li>
          <li>Retry 2: 2 minutes</li>
          <li>Retry 3: 15 minutes</li>
          <li>Retry 4: 1 hour</li>
          <li>Retry 5: 4 hours</li>
        </ul>
        <p>After 5 failed attempts the delivery is marked as failed. You can manually retry from the Webhooks log in the dashboard.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Testing</h2>
        <p>Use the &quot;Send Test Event&quot; button in the dashboard to send a sample payload to your endpoint. The test event is identical in structure to a real event but includes <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">&quot;test&quot;: true</code> in the payload.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> — Query and manage resources. <Link href="/docs/sdks" className="text-app-accent-text hover:underline">SDKs</Link> — Client libraries with webhook helpers.</p>
      </section>
    </DocsLayout>
  );
}
