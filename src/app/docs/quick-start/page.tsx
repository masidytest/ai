"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function QuickStartPage() {
  return (
    <DocsLayout title="Quick Start" description="Create your first project in under 5 minutes." currentPath="/docs/quick-start">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Step 1: Create an Account</h2>
        <p>
          Visit <Link href="/signup" className="text-app-accent-text hover:underline">masidy.com/signup</Link> and enter your name, email, and a password. You can also sign up with your GitHub account for one-click onboarding. No credit card is required for the free tier.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Step 2: Create a Project</h2>
        <p>
          After logging in, click <strong className="text-app-text">New Project</strong> from the dashboard. Choose a name, select a framework template (Next.js, Express, Python Flask, or Blank), and optionally connect a Git repository. Masidy will scaffold the project structure and configure the build pipeline automatically.
        </p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`# Or from the CLI:
masidy init my-project --template nextjs
cd my-project
masidy dev`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Step 3: Open the AI IDE</h2>
        <p>
          Navigate to <strong className="text-app-text">AI IDE</strong> from the sidebar. The editor loads your project files with full syntax highlighting, IntelliSense, and AI-powered suggestions. Start writing code — the AI assistant has full project context and can suggest multi-file changes, generate functions from comments, and refactor existing code.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Step 4: Deploy</h2>
        <p>
          Click the <strong className="text-app-text">Deploy</strong> button in the top bar or push to your connected Git repository. Masidy automatically detects the build command, installs dependencies, builds the project, and deploys it to a globally distributed CDN. Your application is live at <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">your-project.masidy.app</code> within 30 seconds.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Step 5: Add a Database (Optional)</h2>
        <p>
          Navigate to <strong className="text-app-text">Database</strong> from the sidebar. Click <strong className="text-app-text">Create Database</strong>, choose PostgreSQL, MySQL, or MongoDB, and select a region. The database provisions in about 15 seconds. Your connection string is available in the project environment variables automatically — no manual configuration needed.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Step 6: Connect a Domain (Optional)</h2>
        <p>
          Go to <strong className="text-app-text">Domains</strong> and add your custom domain. Point your DNS to the provided CNAME record. Masidy provisions a free SSL certificate within minutes and routes traffic to your deployment. Wildcard SSL is available on Enterprise plans.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">What&apos;s Next</h2>
        <p>
          Explore the <Link href="/docs/ai-ide" className="text-app-accent-text hover:underline">AI IDE documentation</Link> for advanced features like multi-file refactoring and live preview. Set up <Link href="/docs/workflow-automation" className="text-app-accent-text hover:underline">Workflow Automation</Link> to automate your deployment pipeline. Or browse the <Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API reference</Link> to integrate Masidy into your existing tools.
        </p>
      </section>
    </DocsLayout>
  );
}
