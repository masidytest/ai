"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const channels = [
  { name: "Discord Server", desc: "Join 12,000+ developers for real-time help, project showcases, and feature discussions.", members: "12.4k", icon: "M8 12a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zM7.5 15.5S9 17 12 17s4.5-1.5 4.5-1.5", cta: "Join Discord", href: "https://discord.gg/masidy" },
  { name: "GitHub Discussions", desc: "Ask questions, share ideas, and browse community-driven Q&A threads.", members: "8.2k", icon: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z", cta: "Browse Discussions", href: "https://github.com/masidy/community/discussions" },
  { name: "Community Forum", desc: "Long-form discussions, tutorials, and best practices shared by the community.", members: "5.6k", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1m0 0V6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H9z", cta: "Visit Forum", href: "https://community.masidy.com" },
];

const stats = [
  { label: "Community Members", value: "26,000+" },
  { label: "Open Source Plugins", value: "340+" },
  { label: "Templates Shared", value: "1,200+" },
  { label: "Questions Answered", value: "18,500+" },
];

const contributors = [
  { name: "Sarah Chen", role: "Top Contributor", contributions: 142, avatar: "SC" },
  { name: "Marcus Rivera", role: "Plugin Author", contributions: 98, avatar: "MR" },
  { name: "Aisha Patel", role: "Community Mod", contributions: 87, avatar: "AP" },
  { name: "Liam O'Brien", role: "Guide Writer", contributions: 73, avatar: "LO" },
  { name: "Yuki Tanaka", role: "Template Creator", contributions: 64, avatar: "YT" },
  { name: "Priya Sharma", role: "Bug Hunter", contributions: 58, avatar: "PS" },
];

export default function CommunityPage() {
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
            <span className="gradient-text">Community</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Connect with thousands of developers building with Masidy. Learn, share, and grow together.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-app-card border border-app-border rounded-xl p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-2xl font-bold text-app-accent-text mb-1">{s.value}</div>
              <div className="text-xs text-app-text-muted">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-bold mb-6">Join the Conversation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {channels.map((ch, i) => (
            <a key={ch.name} href={ch.href} target="_blank" rel="noopener noreferrer">
              <motion.div
                className="bg-app-card border border-app-border rounded-2xl p-6 hover:border-app-accent/30 transition-all group h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-xl bg-app-accent/10 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={ch.icon} /></svg>
                </div>
                <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors mb-1">{ch.name}</h3>
                <p className="text-xs text-app-text-muted mb-1">{ch.members} members</p>
                <p className="text-sm text-app-text-muted leading-relaxed mb-4">{ch.desc}</p>
                <span className="inline-block text-sm font-medium text-app-accent-text">{ch.cta} &rarr;</span>
              </motion.div>
            </a>
          ))}
        </div>
      </section>

      {/* Top contributors */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-xl font-bold mb-6">Top Contributors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {contributors.map((c, i) => (
            <motion.div
              key={c.name}
              className="bg-app-card border border-app-border rounded-xl p-4 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-app-accent/30 to-purple-500/20 flex items-center justify-center mx-auto mb-3 text-sm font-bold text-app-accent-text">
                {c.avatar}
              </div>
              <div className="font-medium text-sm text-app-text truncate">{c.name}</div>
              <div className="text-xs text-app-text-muted">{c.role}</div>
              <div className="text-xs text-app-accent-text mt-1">{c.contributions} contributions</div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
