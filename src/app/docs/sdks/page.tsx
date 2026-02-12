"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function SdksDocs() {
  return (
    <DocsLayout title="SDKs" description="Official client libraries for Node.js, Python, and Go." currentPath="/docs/sdks">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>Masidy provides official SDKs for Node.js, Python, and Go. Each SDK wraps the <Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> with idiomatic methods, automatic retries, pagination helpers, and TypeScript / type-hint support.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Node.js / TypeScript</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`npm install @masidy/sdk`}</pre>
        </div>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto mt-3">
          <pre>{`import { Masidy } from "@masidy/sdk";

const masidy = new Masidy({ apiKey: process.env.MASIDY_API_KEY });

// List projects
const projects = await masidy.projects.list();

// Create a deployment
const deployment = await masidy.deployments.create("proj_a1b2c3", {
  branch: "main",
  environment: "production",
});

// Create a database
const db = await masidy.databases.create({
  engine: "postgres",
  region: "us-east-1",
  name: "my-app-db",
});

console.log(deployment.url); // https://my-app.masidy.app`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Python</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`pip install masidy`}</pre>
        </div>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto mt-3">
          <pre>{`import masidy
import os

client = masidy.Client(api_key=os.environ["MASIDY_API_KEY"])

# List projects
projects = client.projects.list()

# Trigger deployment
deployment = client.deployments.create(
    project_id="proj_a1b2c3",
    branch="main",
    environment="production",
)

# Query database
result = client.databases.query(
    database_id="db_x1y2z3",
    sql="SELECT * FROM users LIMIT 10",
)

print(deployment.url)  # https://my-app.masidy.app`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Go</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`go get github.com/masidy/masidy-go`}</pre>
        </div>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto mt-3">
          <pre>{`package main

import (
    "context"
    "fmt"
    "os"

    "github.com/masidy/masidy-go"
)

func main() {
    client := masidy.NewClient(os.Getenv("MASIDY_API_KEY"))
    ctx := context.Background()

    // List projects
    projects, _ := client.Projects.List(ctx, nil)

    // Create deployment
    dpl, _ := client.Deployments.Create(ctx, "proj_a1b2c3", &masidy.DeploymentParams{
        Branch:      "main",
        Environment: "production",
    })

    fmt.Println(dpl.URL) // https://my-app.masidy.app
}`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Common Features</h2>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">Auto-retry</strong> — Transient errors (5xx, timeouts) are retried 3 times with exponential backoff.</li>
          <li><strong className="text-app-text">Pagination</strong> — Use <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">.list()</code> iterators that automatically fetch the next page.</li>
          <li><strong className="text-app-text">Webhook verification</strong> — Built-in helpers to verify webhook signatures.</li>
          <li><strong className="text-app-text">Type safety</strong> — TypeScript types, Python type hints, and Go structs for every resource.</li>
          <li><strong className="text-app-text">Logging</strong> — Enable debug logging for troubleshooting API calls.</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Webhook Verification Helper</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`// Node.js
import { Masidy } from "@masidy/sdk";

const isValid = Masidy.webhooks.verify(
  requestBody,
  headers["x-masidy-signature"],
  "whsec_your_secret"
);`}</pre>
        </div>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto mt-3">
          <pre>{`# Python
valid = masidy.webhooks.verify(
    payload=request.body,
    signature=request.headers["x-masidy-signature"],
    secret="whsec_your_secret",
)`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Requirements</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">SDK</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Min Version</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Package</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Node.js</td><td className="px-4 py-2">Node 18+</td><td className="px-4 py-2 font-mono">@masidy/sdk</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Python</td><td className="px-4 py-2">Python 3.10+</td><td className="px-4 py-2 font-mono">masidy</td></tr>
              <tr><td className="px-4 py-2">Go</td><td className="px-4 py-2">Go 1.21+</td><td className="px-4 py-2 font-mono">github.com/masidy/masidy-go</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> — Full endpoint reference. <Link href="/docs/webhooks" className="text-app-accent-text hover:underline">Webhooks</Link> — Event notifications.</p>
      </section>
    </DocsLayout>
  );
}
