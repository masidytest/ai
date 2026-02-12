"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const positions = [
  { title: "Senior Frontend Engineer", team: "Platform", location: "Remote", type: "Full-time", tags: ["React", "TypeScript", "Next.js"] },
  { title: "AI/ML Engineer", team: "AI", location: "Remote", type: "Full-time", tags: ["Python", "LLMs", "Fine-tuning"] },
  { title: "Backend Engineer", team: "Infrastructure", location: "Remote", type: "Full-time", tags: ["Node.js", "PostgreSQL", "Redis"] },
  { title: "DevOps Engineer", team: "Cloud", location: "Remote", type: "Full-time", tags: ["Kubernetes", "Terraform", "AWS"] },
  { title: "Product Designer", team: "Design", location: "Remote", type: "Full-time", tags: ["Figma", "Design Systems", "UX"] },
  { title: "Developer Advocate", team: "Community", location: "Remote", type: "Full-time", tags: ["Writing", "Speaking", "Open Source"] },
];

const perks = [
  { title: "Remote-First", desc: "Work from anywhere in the world. We're distributed across 12 countries.", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { title: "Competitive Equity", desc: "Meaningful stock options that vest over 4 years. Your success is our success.", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
  { title: "Learning Budget", desc: "$2,500/year for conferences, courses, books, and professional growth.", icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" },
  { title: "Health & Wellness", desc: "Premium health insurance, mental health support, and gym membership.", icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" },
  { title: "Unlimited PTO", desc: "Take the time you need. We trust you to manage your schedule responsibly.", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { title: "Latest Hardware", desc: "MacBook Pro or equivalent, 4K display, and any tools you need to do your best work.", icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-app-accent/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join the <span className="gradient-text">Masidy</span> team
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Help us build the platform that replaces the entire dev stack. We&apos;re hiring passionate engineers, designers, and advocates worldwide.
          </motion.p>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Why Masidy?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              className="bg-app-card border border-app-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={p.icon}/></svg>
              </div>
              <h3 className="font-semibold text-app-text mb-2">{p.title}</h3>
              <p className="text-sm text-app-text-muted leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((pos, i) => (
            <motion.div
              key={pos.title}
              className="bg-app-card border border-app-border rounded-xl p-5 hover:border-app-accent/30 transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 4 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors">{pos.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-app-text-muted">
                    <span>{pos.team}</span>
                    <span className="w-1 h-1 rounded-full bg-app-text-muted" />
                    <span>{pos.location}</span>
                    <span className="w-1 h-1 rounded-full bg-app-text-muted" />
                    <span>{pos.type}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pos.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-app-accent/10 text-app-accent-text">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-app-text-muted mb-4">Don&apos;t see a role that fits? We&apos;re always looking for exceptional people.</p>
          <a href="/contact" className="inline-block px-6 py-3 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors">
            Get in Touch
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
