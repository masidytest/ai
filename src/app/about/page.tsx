"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const team = [
  { name: "Ahmed Ragab", role: "Founder & CEO", bio: "Full-stack engineer with a vision to simplify the entire development lifecycle." },
  { name: "Sara Chen", role: "CTO", bio: "Former Google engineer leading AI/ML integration across the Masidy platform." },
  { name: "Marcus Wright", role: "Head of Product", bio: "10+ years in developer tools, shaping the future of how teams build software." },
  { name: "Leila Park", role: "Head of Design", bio: "Design systems expert crafting the premium Masidy experience." },
];

const values = [
  { title: "Developer First", desc: "Every decision starts with developer experience. We build tools we want to use ourselves.", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
  { title: "Ship Fast", desc: "Speed matters. We help teams go from idea to production in minutes, not months.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "AI-Native", desc: "AI isn't an add-on. It's woven into every layer of the platform from day one.", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
  { title: "Open & Transparent", desc: "We share our roadmap, pricing, and thinking publicly. No surprises, ever.", icon: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" },
];

const milestones = [
  { year: "2024", event: "Masidy founded with a mission to replace the fragmented dev stack" },
  { year: "2024", event: "Launched AI IDE and UI Builder in private beta" },
  { year: "2025", event: "Public launch with 26 integrated engines" },
  { year: "2025", event: "10,000+ developers on the platform" },
  { year: "2026", event: "Enterprise tier and SOC 2 compliance achieved" },
];

export default function AboutPage() {
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
            Building the future of <span className="gradient-text">development</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Masidy replaces your entire dev stack with a single AI-powered platform. We believe building software should be fast, intuitive, and accessible to everyone.
          </motion.p>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              className="bg-app-card border border-app-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon}/></svg>
              </div>
              <h3 className="font-semibold text-app-text mb-2">{v.title}</h3>
              <p className="text-sm text-app-text-muted leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Our Journey</h2>
        <div className="relative border-l-2 border-app-border pl-8 space-y-8">
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-app-accent border-4 border-app-bg" />
              <span className="text-xs font-semibold text-app-accent-text">{m.year}</span>
              <p className="text-app-text-secondary mt-1">{m.event}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-app-card border border-app-border rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-16 h-16 rounded-full bg-app-accent/10 mx-auto mb-4 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <h3 className="font-semibold text-app-text">{t.name}</h3>
              <p className="text-sm text-app-accent-text mb-2">{t.role}</p>
              <p className="text-sm text-app-text-muted leading-relaxed">{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
