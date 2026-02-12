"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function DomainsDocs() {
  return (
    <DocsLayout title="Domains" description="Register, configure, and manage custom domains." currentPath="/docs/domains">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>Masidy Domains lets you register new domains, transfer existing domains, configure DNS records, and bind custom domains to your projects — all from a single dashboard. Every domain gets free SSL certificates via Let&apos;s Encrypt with automatic renewal.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Registering a Domain</h2>
        <p>Search for an available domain from the Domains page in the dashboard. Masidy supports over 400 TLDs including .com, .io, .dev, .app, .ai, and country-code TLDs. After purchase, the domain is automatically configured with Masidy nameservers.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Search for a domain
masidy domain search example.com

# Register a domain
masidy domain register example.com --years 1

# Transfer a domain from another registrar
masidy domain transfer example.com --auth-code EPP_AUTH_CODE`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Connecting to a Project</h2>
        <p>Open your project settings, go to the Domains tab, and click Add Domain. Enter your custom domain. If the domain is registered with Masidy, DNS records are configured automatically. For external domains, follow the instructions to point your DNS to Masidy&apos;s servers.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">DNS Management</h2>
        <p>The DNS Manager supports A, AAAA, CNAME, MX, TXT, SRV, and NS records. Changes propagate globally within 60 seconds through Masidy&apos;s edge network.</p>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Record</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Example</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Use Case</th></tr></thead>
            <tbody className="text-app-text-secondary">
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">A</td><td className="px-4 py-2">@ → 76.76.21.21</td><td className="px-4 py-2">Point root domain to host</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">CNAME</td><td className="px-4 py-2">www → cname.masidy.com</td><td className="px-4 py-2">Alias subdomain to Masidy</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">MX</td><td className="px-4 py-2">@ → mx.masidy.com</td><td className="px-4 py-2">Email routing</td></tr>
              <tr className="border-b border-app-border/50"><td className="px-4 py-2">TXT</td><td className="px-4 py-2">@ → &quot;v=spf1 ...&quot;</td><td className="px-4 py-2">Email auth, domain verification</td></tr>
              <tr><td className="px-4 py-2">SRV</td><td className="px-4 py-2">_sip._tcp → ...</td><td className="px-4 py-2">Service discovery</td></tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">SSL Certificates</h2>
        <p>SSL certificates are automatically provisioned and renewed via Let&apos;s Encrypt for every domain and subdomain connected to a Masidy project. No configuration is required. Certificates are issued within seconds of domain verification and renew 30 days before expiration.</p>
        <p>Enterprise customers can also upload custom certificates for compliance requirements.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">WHOIS Privacy</h2>
        <p>WHOIS privacy protection is enabled by default and free for all Masidy-registered domains. Your personal contact information is replaced with Masidy privacy proxy details in the WHOIS database.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Subdomains</h2>
        <p>Create unlimited subdomains and bind each to a different project or environment. For example:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">app.example.com</code> → Production deployment</li>
          <li><code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">staging.example.com</code> → Staging environment</li>
          <li><code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">api.example.com</code> → API server</li>
          <li><code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">docs.example.com</code> → Documentation site</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/cloud-hosting" className="text-app-accent-text hover:underline">Cloud Hosting</Link> — Deploy to custom domains. <Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> — Manage domains programmatically.</p>
      </section>
    </DocsLayout>
  );
}
