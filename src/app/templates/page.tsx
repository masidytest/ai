"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Footer } from "../../components/Footer";

const templates = [
  { name: "SaaS Dashboard", desc: "Full-featured admin dashboard with analytics, user management, and billing.", tags: ["Next.js", "Tailwind", "Stripe"], color: "from-violet-500/20 to-purple-500/10", slug: "saas-dashboard" },
  { name: "E-Commerce Store", desc: "Complete storefront with cart, checkout, and product management.", tags: ["React", "Node.js", "PostgreSQL"], color: "from-blue-500/20 to-cyan-500/10", slug: "ecommerce-store" },
  { name: "Blog Platform", desc: "Modern blog with MDX support, syntax highlighting, and SEO optimization.", tags: ["Next.js", "MDX", "Tailwind"], color: "from-emerald-500/20 to-green-500/10", slug: "blog-platform" },
  { name: "AI Chat App", desc: "Conversational interface with streaming responses and message history.", tags: ["React", "OpenAI", "WebSocket"], color: "from-amber-500/20 to-orange-500/10", slug: "ai-chat-app" },
  { name: "Landing Page", desc: "Conversion-optimized landing page with hero, features, and pricing.", tags: ["Next.js", "Framer Motion", "Tailwind"], color: "from-rose-500/20 to-pink-500/10", slug: "landing-page" },
  { name: "REST API Server", desc: "Production-ready API with authentication, validation, and rate limiting.", tags: ["Express", "TypeScript", "JWT"], color: "from-sky-500/20 to-blue-500/10", slug: "rest-api-server" },
  { name: "Real-Time Dashboard", desc: "Live data visualization with WebSocket updates and interactive charts.", tags: ["React", "D3.js", "Socket.io"], color: "from-fuchsia-500/20 to-purple-500/10", slug: "realtime-dashboard" },
  { name: "Portfolio Site", desc: "Clean developer portfolio with project showcase and contact form.", tags: ["Next.js", "Framer Motion", "MDX"], color: "from-teal-500/20 to-emerald-500/10", slug: "portfolio-site" },
  { name: "CRM System", desc: "Customer relationship manager with pipeline view and activity tracking.", tags: ["React", "Prisma", "PostgreSQL"], color: "from-indigo-500/20 to-violet-500/10", slug: "crm-system" },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-app-accent/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="gradient-text">Templates</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Kickstart your next project with production-ready templates. Clone, customize, and deploy in minutes.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.name}
              className="bg-app-card border border-app-border rounded-2xl overflow-hidden hover:border-app-accent/30 hover:shadow-lg transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className={`h-32 bg-gradient-to-br ${tpl.color} flex items-center justify-center`}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-app-text-muted">
                  <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors mb-2">{tpl.name}</h3>
                <p className="text-sm text-app-text-muted mb-4 leading-relaxed">{tpl.desc}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-app-accent/10 text-app-accent-text border border-app-accent/20">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Link href={`/signup?template=${tpl.slug}`} className="flex-1 text-center px-3 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text font-medium text-xs hover:bg-app-btn-primary-hover transition-colors">
                    Use Template
                  </Link>
                  <Link href={`/docs/quick-start`} className="flex-1 text-center px-3 py-2 rounded-lg border border-app-border text-app-text-secondary font-medium text-xs hover:border-app-accent/30 hover:text-app-accent-text transition-colors">
                    View Docs
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
