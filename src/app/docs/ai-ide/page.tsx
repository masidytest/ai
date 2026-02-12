"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function AiIdeDocs() {
  return (
    <DocsLayout title="AI IDE" description="Code with AI-powered suggestions and refactoring." currentPath="/docs/ai-ide">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>The Masidy AI IDE is a full-featured, browser-based code editor powered by an AI assistant that understands your entire project context. It supports multi-file editing, inline suggestions, one-click refactoring, a built-in terminal, and a live preview panel for frontend applications.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Features</h2>
        <ul className="space-y-2 ml-4 list-disc">
          <li><strong className="text-app-text">AI Code Completion</strong> — Context-aware suggestions that consider your full project, including imports, types, and adjacent files. Press Tab to accept.</li>
          <li><strong className="text-app-text">Multi-File Editing</strong> — Open and edit multiple files in split panes. The AI understands relationships between files for cross-file refactoring.</li>
          <li><strong className="text-app-text">Live Preview</strong> — An embedded browser panel renders your frontend in real-time. Supports HTML, React, Next.js, and static sites with hot reload.</li>
          <li><strong className="text-app-text">AI Chat</strong> — Ask the AI assistant to explain code, generate functions, fix bugs, write tests, or refactor. Responses can be applied directly to your code with one click.</li>
          <li><strong className="text-app-text">Integrated Terminal</strong> — Run commands, install packages, and monitor build output without leaving the editor.</li>
          <li><strong className="text-app-text">Syntax Highlighting</strong> — Full support for TypeScript, JavaScript, Python, Go, Rust, HTML, CSS, JSON, YAML, SQL, Markdown, and 20+ other languages.</li>
          <li><strong className="text-app-text">Git Integration</strong> — View diffs, stage changes, commit, push, and create pull requests directly from the editor.</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Keyboard Shortcuts</h2>
        <div className="bg-app-card border border-app-border rounded-xl overflow-hidden">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-app-border"><th className="text-left px-4 py-2 text-app-text-muted font-medium">Shortcut</th><th className="text-left px-4 py-2 text-app-text-muted font-medium">Action</th></tr></thead>
            <tbody className="text-app-text-secondary">
              {[["Ctrl/Cmd + S","Save file"],["Ctrl/Cmd + P","Quick open file"],["Ctrl/Cmd + Shift + P","Command palette"],["Ctrl/Cmd + /","Toggle line comment"],["Ctrl/Cmd + D","Select next occurrence"],["Ctrl/Cmd + Shift + L","Select all occurrences"],["Ctrl/Cmd + `","Toggle terminal"],["Ctrl/Cmd + K","Open AI chat"],["Tab","Accept AI suggestion"],["Esc","Dismiss suggestion"]].map(([k,v])=>(
                <tr key={k} className="border-b border-app-border/50"><td className="px-4 py-2 font-mono text-app-accent-text">{k}</td><td className="px-4 py-2">{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">AI Prompting Tips</h2>
        <p>The AI assistant works best with clear, specific instructions. Here are examples of effective prompts:</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`// Good: "Create a REST endpoint for user registration 
//         with email validation and bcrypt password hashing"

// Good: "Refactor this function to use async/await instead
//         of .then() chains"

// Good: "Write unit tests for the calculateTotal function
//         covering edge cases like empty cart and discounts"

// Less effective: "Fix this code"
// Less effective: "Make it better"`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Device Preview</h2>
        <p>The live preview panel includes device size presets for responsive testing: mobile (375px), tablet (768px), and desktop (1280px). You can also enter a custom viewport width. The preview updates in real-time as you edit code.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p>
          <Link href="/docs/ui-builder" className="text-app-accent-text hover:underline">UI Builder</Link> — Build interfaces visually with drag-and-drop.
          {" "}<Link href="/docs/rest-api" className="text-app-accent-text hover:underline">REST API</Link> — Programmatic access to the IDE features.
        </p>
      </section>
    </DocsLayout>
  );
}
