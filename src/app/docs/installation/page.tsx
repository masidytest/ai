"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function InstallationPage() {
  return (
    <DocsLayout title="Installation" description="Set up the CLI and connect your account." currentPath="/docs/installation">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">System Requirements</h2>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Node.js 18 or later</li>
          <li>npm, yarn, or pnpm</li>
          <li>macOS, Linux, or Windows (WSL recommended)</li>
          <li>Git (optional, for repository integration)</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Install the Masidy CLI</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Using npm
npm install -g @masidy/cli

# Using yarn
yarn global add @masidy/cli

# Using pnpm
pnpm add -g @masidy/cli`}</pre>
        </div>
        <p>Verify the installation:</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`masidy --version
# Output: masidy v2.4.1`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Authenticate</h2>
        <p>Log in to your Masidy account from the terminal. This opens a browser window for secure OAuth authentication:</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`masidy login
# Opens browser → Authorize → Token saved to ~/.masidy/credentials`}</pre>
        </div>
        <p>For CI/CD environments, use an API key instead:</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`export MASIDY_API_KEY=sk_live_your_key_here
masidy whoami
# Output: Authenticated as you@masidy.com`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Initialize a Project</h2>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Create a new project from a template
masidy init my-app --template nextjs

# Or link an existing directory
cd existing-project
masidy link`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">CLI Commands Reference</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Command</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Description</th></tr></thead>
            <tbody className="text-app-text-secondary">
              {[
                ["masidy init [name]", "Create a new project"],
                ["masidy dev", "Start local development server"],
                ["masidy deploy", "Deploy current project to production"],
                ["masidy deploy --preview", "Create a preview deployment"],
                ["masidy env set KEY=VALUE", "Set an environment variable"],
                ["masidy db create --engine postgres", "Provision a new database"],
                ["masidy domains add example.com", "Add a custom domain"],
                ["masidy logs --follow", "Stream live deployment logs"],
                ["masidy whoami", "Show authenticated user"],
                ["masidy logout", "Clear stored credentials"],
              ].map(([cmd, desc]) => (
                <tr key={cmd} className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-app-accent-text">{cmd}</td><td className="px-4 py-2">{desc}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Next Steps</h2>
        <p>
          Now that the CLI is installed, follow the <Link href="/docs/quick-start" className="text-app-accent-text hover:underline">Quick Start guide</Link> to create and deploy your first project.
        </p>
      </section>
    </DocsLayout>
  );
}
