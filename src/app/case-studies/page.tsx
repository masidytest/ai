"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const studies = [
  {
    company: "NovaPay",
    industry: "Fintech",
    logo: "NP",
    quote: "Masidy cut our development time by 60%. We shipped a full payment dashboard in 3 weeks instead of 3 months.",
    author: "Elena Torres, CTO",
    metric: "60%",
    metricLabel: "Faster Development",
    color: "from-violet-500/20 to-indigo-500/10",
  },
  {
    company: "HealthSync",
    industry: "Healthcare",
    logo: "HS",
    quote: "The AI IDE and workflow automation let our small team build HIPAA-compliant features without hiring specialists.",
    author: "Dr. James Liu, Co-founder",
    metric: "4x",
    metricLabel: "Team Productivity",
    color: "from-emerald-500/20 to-teal-500/10",
  },
  {
    company: "ShopFlow",
    industry: "E-Commerce",
    logo: "SF",
    quote: "We migrated 200+ microservices to Masidy Cloud. Deployment time dropped from 40 minutes to under 90 seconds.",
    author: "Priya Mehta, VP Engineering",
    metric: "90s",
    metricLabel: "Deploy Time",
    color: "from-amber-500/20 to-orange-500/10",
  },
  {
    company: "EduNest",
    industry: "EdTech",
    logo: "EN",
    quote: "The UI Builder saved us from hiring a frontend team. Our product designer now ships production-ready pages directly.",
    author: "Carlos Ruiz, CEO",
    metric: "$240k",
    metricLabel: "Annual Savings",
    color: "from-blue-500/20 to-cyan-500/10",
  },
  {
    company: "DevOpsly",
    industry: "Developer Tools",
    logo: "DO",
    quote: "Masidy's database and hosting combo replaced 5 separate services. One platform, one bill, zero DevOps overhead.",
    author: "Sam Park, Founder",
    metric: "5 → 1",
    metricLabel: "Tools Consolidated",
    color: "from-rose-500/20 to-pink-500/10",
  },
  {
    company: "GreenGrid",
    industry: "CleanTech",
    logo: "GG",
    quote: "We built our IoT monitoring dashboard with real-time data from 50k sensors using Masidy's workflow engine.",
    author: "Nina Andersson, Lead Engineer",
    metric: "50k",
    metricLabel: "Real-time Sensors",
    color: "from-teal-500/20 to-emerald-500/10",
  },
];

export default function CaseStudiesPage() {
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
            <span className="gradient-text">Case Studies</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            See how teams of all sizes use Masidy to build faster and scale smarter.
          </motion.p>
        </div>
      </section>

      {/* Studies */}
      <section className="max-w-5xl mx-auto px-4 py-8 pb-20 space-y-8">
        {studies.map((s, i) => (
          <motion.div
            key={s.company}
            className="bg-app-card border border-app-border rounded-2xl overflow-hidden hover:border-app-accent/30 transition-all"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Metric card */}
              <div className={`md:w-56 shrink-0 bg-gradient-to-br ${s.color} flex flex-col items-center justify-center p-8`}>
                <div className="text-3xl font-black text-app-text mb-1">{s.metric}</div>
                <div className="text-sm text-app-text-muted">{s.metricLabel}</div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-app-accent/10 flex items-center justify-center text-sm font-bold text-app-accent-text">
                    {s.logo}
                  </div>
                  <div>
                    <h3 className="font-semibold text-app-text">{s.company}</h3>
                    <span className="text-xs text-app-text-muted">{s.industry}</span>
                  </div>
                </div>
                <blockquote className="text-app-text-secondary text-sm leading-relaxed mb-4 italic">
                  &ldquo;{s.quote}&rdquo;
                </blockquote>
                <p className="text-xs text-app-text-muted">&mdash; {s.author}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
