"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function DatabaseDocs() {
  return (
    <DocsLayout title="Database" description="Provision, manage, and query databases from the dashboard." currentPath="/docs/database">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>Masidy Database lets you provision managed database instances directly from the dashboard. Every database is backed up automatically, encrypted at rest and in transit, and accessible from any Masidy project or external application.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Supported Engines</h2>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">PostgreSQL 15 / 16</strong> — Full SQL, JSON support, extensions (PostGIS, pgvector, pg_trgm).</li>
          <li><strong className="text-app-text">MySQL 8</strong> — InnoDB, replication, full-text search.</li>
          <li><strong className="text-app-text">MongoDB 7</strong> — Document store, aggregation pipeline, Atlas-compatible.</li>
          <li><strong className="text-app-text">Redis 7</strong> — In-memory key-value, pub/sub, streams.</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Provisioning</h2>
        <p>Create a database from the dashboard or CLI. Choose the engine, region, and plan. The instance is ready within 30 seconds.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Create a PostgreSQL database
masidy db create --engine postgres --region us-east-1 --name my-app-db

# Create a Redis cache
masidy db create --engine redis --region eu-west-1 --name session-cache`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">SQL Console</h2>
        <p>The built-in SQL Console lets you run queries directly from the dashboard. It includes syntax highlighting, auto-complete for table and column names, query history, and result export to CSV or JSON.</p>
        <p>To access it, open your project, navigate to the Database tab, and click SQL Console on your database instance.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Schema Browser</h2>
        <p>The Schema Browser shows every table, column, index, and relationship in your database. Click any table to view its columns with types, constraints, and default values. Foreign key relationships are visualized as a graph.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Backups &amp; Snapshots</h2>
        <p>Automatic daily backups are enabled by default and retained for 7 days (Starter), 30 days (Pro), or 90 days (Enterprise). You can also create manual snapshots at any time.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Create a manual snapshot
masidy db snapshot create --database my-app-db --label "pre-migration"

# Restore from snapshot
masidy db snapshot restore --snapshot snap_abc123 --target my-app-db-restored`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Migrations</h2>
        <p>Masidy tracks schema migrations alongside your code. Create migration files with the CLI and they run automatically on deploy.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Generate a migration
masidy db migrate create add-users-table

# Run pending migrations
masidy db migrate run

# Roll back the last migration
masidy db migrate rollback`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Connection Pooling</h2>
        <p>Connection pooling is built in and enabled by default. The pooler runs alongside your database and maintains a pool of persistent connections, reducing connection overhead and preventing exhaustion. Connection strings are available from the dashboard or <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">masidy db info</code>.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Plan Limits</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Plan</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Storage</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Connections</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Backups</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Replicas</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Starter</td><td className="px-4 py-2">1 GB</td><td className="px-4 py-2">20</td><td className="px-4 py-2">7-day</td><td className="px-4 py-2">0</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">Pro</td><td className="px-4 py-2">50 GB</td><td className="px-4 py-2">200</td><td className="px-4 py-2">30-day</td><td className="px-4 py-2">2</td></tr>
              <tr><td className="px-4 py-2">Enterprise</td><td className="px-4 py-2">Custom</td><td className="px-4 py-2">Custom</td><td className="px-4 py-2">90-day</td><td className="px-4 py-2">Custom</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> — Query databases via API. <Link href="/docs/webhooks" className="text-app-accent-text hover:underline">Webhooks</Link> — Listen for database events.</p>
      </section>
    </DocsLayout>
  );
}
