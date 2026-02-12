"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function IntroductionPage() {
  return (
    <DocsLayout title="Introduction" description="Learn what Masidy is and how it works." currentPath="/docs/introduction">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">What Is Masidy?</h2>
        <p>
          Masidy is an all-in-one AI-powered development platform that combines 26 specialized engines into a single workspace. Instead of stitching together separate services for hosting, databases, CI/CD, domain management, and a code editor, Masidy consolidates everything into one unified experience. You write code, build UIs, automate workflows, manage infrastructure, and monitor performance — all without leaving the platform.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Core Concepts</h2>
        <p>
          Every Masidy account is organized around <strong className="text-app-text">Projects</strong>. A project is a container for your application code, deployed environments, databases, domains, and workflow automations. You can have one project on the free tier, up to 10 on Pro, and unlimited on Enterprise.
        </p>
        <p>
          Inside each project, you work with <strong className="text-app-text">Tools</strong> — the individual engines that power each capability. The AI IDE is a tool. Cloud Hosting is a tool. The Database manager is a tool. All tools share the same project context, so your AI code assistant understands your database schema, your workflow engine can trigger deployments, and your domain manager configures SSL for your hosted application automatically.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Platform Architecture</h2>
        <p>
          Masidy consists of three layers:
        </p>
        <ul className="space-y-2 ml-4">
          <li className="flex gap-2"><span className="text-app-accent-text font-bold">1.</span> <span><strong className="text-app-text">Development Layer</strong> — AI IDE, UI Builder, and code generation engines. This is where you write and build your application.</span></li>
          <li className="flex gap-2"><span className="text-app-accent-text font-bold">2.</span> <span><strong className="text-app-text">Infrastructure Layer</strong> — Cloud Hosting, Database, Domains, and storage. This is where your application runs.</span></li>
          <li className="flex gap-2"><span className="text-app-accent-text font-bold">3.</span> <span><strong className="text-app-text">Automation Layer</strong> — Workflow Engine, deployment pipelines, monitoring, and notifications. This is what keeps everything connected and running smoothly.</span></li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Who Is Masidy For?</h2>
        <p>
          Masidy is built for developers, technical founders, small engineering teams, and agencies who want to move fast without managing a fragmented tool stack. Whether you are a solo developer launching a side project or a 50-person team shipping a SaaS product, Masidy scales with you.
        </p>
        <p>
          Designers and product managers also benefit from the UI Builder and Workflow Engine — tools that let non-engineers contribute directly to the codebase and automation layer without writing code.
        </p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Next Steps</h2>
        <p>
          Ready to start building? Head to the <Link href="/docs/quick-start" className="text-app-accent-text hover:underline">Quick Start guide</Link> to create your first project in under 5 minutes, or visit the <Link href="/docs/installation" className="text-app-accent-text hover:underline">Installation page</Link> to set up the Masidy CLI on your local machine.
        </p>
      </section>
    </DocsLayout>
  );
}
