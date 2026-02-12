"use client";
import Link from "next/link";
import { DocsLayout } from "../DocsLayout";

export default function UiBuilderDocs() {
  return (
    <DocsLayout title="UI Builder" description="Drag-and-drop visual interface builder." currentPath="/docs/ui-builder">
      <section className="space-y-6 text-app-text-secondary text-sm leading-relaxed">
        <h2 className="text-xl font-semibold text-app-text">Overview</h2>
        <p>The Masidy UI Builder is a canvas-based visual editor that lets you build responsive user interfaces by dragging and dropping components. It generates clean React and Tailwind CSS code that integrates directly into your project — no proprietary markup or vendor lock-in.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Component Library</h2>
        <p>The builder ships with 40+ pre-built components organized into categories:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li><strong className="text-app-text">Layout</strong> — Container, Grid, Flex, Section, Divider, Spacer</li>
          <li><strong className="text-app-text">Typography</strong> — Heading, Paragraph, Label, Code Block, Badge</li>
          <li><strong className="text-app-text">Forms</strong> — Input, Textarea, Select, Checkbox, Radio, Switch, Date Picker</li>
          <li><strong className="text-app-text">Navigation</strong> — Navbar, Sidebar, Tabs, Breadcrumb, Pagination</li>
          <li><strong className="text-app-text">Data Display</strong> — Table, Card, List, Avatar, Stat, Progress Bar</li>
          <li><strong className="text-app-text">Feedback</strong> — Alert, Toast, Modal, Dialog, Tooltip, Skeleton</li>
          <li><strong className="text-app-text">Media</strong> — Image, Video, Icon, Carousel</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Working with the Canvas</h2>
        <p>Drag a component from the left palette onto the canvas. Components snap to grid guides and respect parent layout rules (flex direction, grid columns). Select a component to see its properties in the right panel where you can edit:</p>
        <ul className="space-y-1 ml-4 list-disc">
          <li>Tailwind utility classes (padding, margin, colors, typography, borders)</li>
          <li>Component-specific props (placeholder text, button variants, image source)</li>
          <li>Responsive breakpoints (mobile, tablet, desktop)</li>
          <li>Event handlers (onClick, onChange, onSubmit)</li>
          <li>Conditional visibility (show/hide based on state)</li>
        </ul>

        <h2 className="text-xl font-semibold text-app-text mt-8">Responsive Design</h2>
        <p>Switch between device breakpoints (mobile 375px, tablet 768px, desktop 1280px) using the viewport selector at the top of the canvas. Each breakpoint can have independent layout settings — for example, a 4-column grid on desktop that becomes a single-column stack on mobile.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Code Export</h2>
        <p>The builder generates clean JSX with Tailwind classes. You can view the generated code in the code panel at any time. Exported code runs through a Prettier formatting pass and is ready to copy into your project or commit directly to your repository.</p>
        <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 font-mono text-xs overflow-x-auto">
          <pre>{`// Example generated output
export function HeroSection() {
  return (
    <section className="flex flex-col items-center px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-4">
        Build faster with Masidy
      </h1>
      <p className="text-lg text-gray-500 max-w-2xl text-center mb-8">
        Deploy production apps in minutes.
      </p>
      <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl">
        Get Started
      </button>
    </section>
  );
}`}</pre>
        </div>

        <h2 className="text-xl font-semibold text-app-text mt-8">Custom Components</h2>
        <p>You can register your own components in the builder by adding them to your project&apos;s <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">masidy.config.ts</code> file. Custom components appear in the palette alongside built-in ones and support all the same drag-and-drop and property editing features.</p>

        <h2 className="text-xl font-semibold text-app-text mt-8">Related</h2>
        <p><Link href="/docs/ai-ide" className="text-app-accent-text hover:underline">AI IDE</Link> — Write code alongside visual editing. <Link href="/guides" className="text-app-accent-text hover:underline">Guides</Link> — Step-by-step tutorials.</p>
      </section>
    </DocsLayout>
  );
}
