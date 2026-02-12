"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../components/Footer";

const posts = [
  {
    title: "Introducing Masidy: The All-in-One AI Dev Platform",
    excerpt: "We're launching 26 AI-powered engines in a single platform. Here's why it matters.",
    date: "Feb 10, 2026",
    tag: "Announcement",
    slug: "/blog/introducing-masidy",
  },
  {
    title: "How We Built a Visual UI Builder with Drag-and-Drop",
    excerpt: "A deep dive into our canvas-based component system and real-time preview.",
    date: "Feb 5, 2026",
    tag: "Engineering",
    slug: "/blog/visual-ui-builder",
  },
  {
    title: "Workflow Automation: From Trigger to Production in Minutes",
    excerpt: "Automate complex business logic with our node-based workflow engine.",
    date: "Jan 28, 2026",
    tag: "Product",
    slug: "/blog/workflow-automation",
  },
  {
    title: "Cloud Hosting Without the Complexity",
    excerpt: "Zero-config deployments, auto-scaling, and instant rollbacks.",
    date: "Jan 20, 2026",
    tag: "Infrastructure",
    slug: "/blog/cloud-hosting",
  },
];

export default function BlogPage() {
  return (
    <>
      <main className="min-h-screen bg-app-bg px-4 pt-24 pb-20">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-app-text mb-3">Blog</h1>
          <p className="text-app-text-secondary mb-12">News, updates, and deep dives from the Masidy team.</p>

          <div className="space-y-6">
            {posts.map((post, i) => (
              <Link key={post.slug} href={post.slug}>
              <motion.article
                className="bg-app-card border border-app-border rounded-2xl p-6 hover:border-app-accent/30 hover:shadow-lg transition-all cursor-pointer group mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-app-accent/10 text-app-accent-text">{post.tag}</span>
                  <span className="text-xs text-app-text-muted">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-app-text mb-2 group-hover:text-app-accent-text transition-colors">{post.title}</h2>
                <p className="text-sm text-app-text-secondary leading-relaxed">{post.excerpt}</p>
              </motion.article>
              </Link>
            ))}
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
