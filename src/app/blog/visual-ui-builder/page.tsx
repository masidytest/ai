"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../../components/Footer";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      <main className="px-4 pt-24 pb-20">
        <motion.article
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-app-text-muted hover:text-app-accent-text transition-colors mb-8">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent-text">Engineering</span>
            <span className="text-xs text-app-text-muted">Feb 5, 2026</span>
            <span className="text-xs text-app-text-muted">12 min read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-app-text mb-6 leading-tight">
            How We Built a Visual UI Builder with Drag-and-Drop
          </h1>

          <p className="text-app-text-secondary leading-relaxed mb-6">
            One of the most requested features during our early access program was a way to build user interfaces visually — without writing CSS by hand. After eight months of research and development, we shipped the Masidy UI Builder: a canvas-based, drag-and-drop editor that generates production-ready React components. In this post, we share the technical decisions, architecture challenges, and performance optimizations that went into building it.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">The Problem We Were Solving</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Most visual builders fall into one of two camps. Low-code platforms generate proprietary markup that locks you into their ecosystem. Design-to-code tools like Figma plugins produce CSS that rarely matches what a developer would write by hand. We wanted something different: a builder that outputs clean, idiomatic React and Tailwind code — the same code a senior engineer would write — while letting designers and product managers contribute directly to the codebase.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Architecture Overview</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            The UI Builder runs entirely in the browser. It consists of four layers:
          </p>
          <ul className="space-y-3 mb-6">
            {[
              ["Component Tree (AST)", "Every element on the canvas is a node in an abstract syntax tree. This tree mirrors a real React component hierarchy. When you drag a button inside a card, it updates the AST exactly as if you had nested JSX elements in code."],
              ["Canvas Renderer", "We render the AST onto a virtual canvas using an iframe sandbox. This ensures pixel-perfect preview while isolating the builder's styles from the user's component styles. The iframe receives the compiled Tailwind stylesheet dynamically."],
              ["Property Inspector", "The right-side panel reads the selected node's AST metadata and exposes editable fields: Tailwind classes, text content, event handlers, responsive breakpoints, and component-specific props. Changes write back to the AST in real-time."],
              ["Code Emitter", "The AST serializes to clean JSX with Tailwind classes. We run a custom Prettier pass to ensure consistent formatting. The output integrates directly into the project's component directory — no copy-paste required."],
            ].map(([title, desc]) => (
              <li key={title} className="flex gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5"><path d="M20 6L9 17l-5-5"/></svg>
                <span className="text-app-text-secondary text-sm leading-relaxed"><strong className="text-app-text">{title}:</strong> {desc}</span>
              </li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">The Drag-and-Drop Engine</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            We built our drag-and-drop system on the HTML Drag and Drop API initially, but quickly hit limitations with nested drop zones and cross-iframe interactions. We switched to a pointer-event-based system using <code className="px-1.5 py-0.5 rounded bg-app-bg-secondary text-app-accent-text text-xs font-mono">PointerEvent</code> capture. The approach works as follows:
          </p>
          <div className="bg-app-bg-secondary border border-app-border rounded-xl p-4 mb-6 font-mono text-xs text-app-text-secondary overflow-x-auto">
            <pre>{`// Simplified drag handler
onPointerDown → capture pointer → record origin
onPointerMove → calculate delta → update ghost position
                → hit-test drop zones via elementFromPoint()
                → highlight valid drop target
onPointerUp   → release capture → commit AST mutation
                → animate element to final position`}</pre>
          </div>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            This approach gives us sub-frame positioning accuracy, works identically across browsers, and handles nested containers (flex layouts inside grid layouts inside card components) without the z-index collisions that plague HTML5 drag-and-drop.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Real-Time Preview</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            The live preview is the UI Builder&apos;s most critical feature. Every change must reflect in the canvas within 16ms to feel instant. We achieve this by maintaining a virtual DOM diff between the previous and current AST states. Only changed nodes re-render in the iframe.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-6">
            For Tailwind class changes, we hot-swap the iframe&apos;s stylesheet using the Tailwind JIT compiler running in a Web Worker. This avoids blocking the main thread and keeps the canvas responsive even when editing complex layouts with hundreds of elements.
          </p>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Performance Benchmarks</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            We tested the builder against real-world page templates to ensure production viability:
          </p>
          <div className="bg-app-card border border-app-border rounded-xl overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-app-border">
                <th className="text-left px-4 py-3 text-app-text-muted font-medium">Metric</th>
                <th className="text-left px-4 py-3 text-app-text-muted font-medium">Result</th>
              </tr></thead>
              <tbody className="text-app-text-secondary">
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Canvas render (100 elements)</td><td className="px-4 py-2.5">4.2ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Drag reorder latency</td><td className="px-4 py-2.5">8ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Property change to preview</td><td className="px-4 py-2.5">12ms</td></tr>
                <tr className="border-b border-app-border/50"><td className="px-4 py-2.5">Code export (500-node page)</td><td className="px-4 py-2.5">340ms</td></tr>
                <tr><td className="px-4 py-2.5">Tailwind JIT recompile</td><td className="px-4 py-2.5">22ms</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-app-text mt-10 mb-4">Lessons Learned</h2>
          <p className="text-app-text-secondary leading-relaxed mb-4">
            Building a visual editor is deceptively complex. The hardest parts were not rendering or drag-and-drop — they were undo/redo across nested operations, handling responsive breakpoint switching without losing layout state, and ensuring the generated code remained human-readable after dozens of visual edits. We rewrote the AST serializer three times before arriving at an output that consistently passes our code quality linter.
          </p>
          <p className="text-app-text-secondary leading-relaxed mb-8">
            If you are interested in building similar tools, we recommend starting with the AST layer. Get the data model right before touching any rendering code. A well-designed AST makes everything else — drag-and-drop, undo, collaboration, code export — dramatically simpler.
          </p>

          <div className="mt-12 p-6 bg-app-card border border-app-border rounded-2xl text-center">
            <p className="text-app-text font-semibold mb-2">Try the UI Builder yourself</p>
            <p className="text-app-text-muted text-sm mb-4">Build your first page visually in under 5 minutes.</p>
            <Link href="/dashboard/builder" className="inline-block px-6 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold text-sm hover:bg-app-btn-primary-hover transition-colors">
              Open UI Builder
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-app-border flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center text-sm font-bold text-app-accent-text">AL</div>
            <div>
              <div className="font-semibold text-app-text text-sm">Alex Lin, Lead Frontend Engineer</div>
              <div className="text-xs text-app-text-muted">alex@masidy.com</div>
            </div>
          </div>
        </motion.article>
      </main>
      <Footer />
    </div>
  );
}
