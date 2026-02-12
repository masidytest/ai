"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const categories = [
  { label: "All", value: "all" },
  { label: "Version Control", value: "vcs" },
  { label: "CI/CD", value: "cicd" },
  { label: "Monitoring", value: "monitoring" },
  { label: "Communication", value: "communication" },
  { label: "Cloud", value: "cloud" },
  { label: "Analytics", value: "analytics" },
];

const integrations = [
  { name: "GitHub", desc: "Push, pull, and deploy directly from your GitHub repositories.", category: "vcs", icon: "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" },
  { name: "GitLab", desc: "Full CI/CD integration with GitLab repos and pipelines.", category: "vcs", icon: "M22 12l-10 9L2 12l3-9h4l3 9 3-9h4l3 9z" },
  { name: "Bitbucket", desc: "Connect Bitbucket repos for seamless source control.", category: "vcs", icon: "M2 5l1.905 11.429A1 1 0 004.89 17.2h14.22a1 1 0 00.985-.771L22 5H2zm8.5 8.5h3l.75-4.5h-4.5l.75 4.5z" },
  { name: "Vercel", desc: "Deploy Next.js and static sites with zero-config Vercel hosting.", category: "cicd", icon: "M12 2l10 18H2L12 2z" },
  { name: "Docker", desc: "Build and deploy containerized applications with Docker support.", category: "cicd", icon: "M4 16s1-1 4-1 4 1 8 1 8-1V9H4v7zM4 9h16V7h-3V5h-2v2h-2V5h-2v2H9V5H7v2H4v2z" },
  { name: "AWS", desc: "Deploy to EC2, S3, Lambda, RDS, and other AWS services.", category: "cloud", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { name: "Google Cloud", desc: "Integrate with GCP services including Cloud Run and Firebase.", category: "cloud", icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" },
  { name: "Datadog", desc: "Monitor your applications with Datadog APM and logging.", category: "monitoring", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { name: "Sentry", desc: "Real-time error tracking and performance monitoring.", category: "monitoring", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  { name: "Slack", desc: "Get deployment notifications and alerts right in Slack.", category: "communication", icon: "M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5zm-5 0c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z" },
  { name: "Discord", desc: "Webhook integration for team notifications and build alerts.", category: "communication", icon: "M8 12a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2zM7.5 15.5S9 17 12 17s4.5-1.5 4.5-1.5M20.27 5.11A16.84 16.84 0 0015.69 4c-.23.4-.49.94-.67 1.36a15.67 15.67 0 00-6.04 0A11.46 11.46 0 008.31 4c-1.63.3-3.2.79-4.58 1.47" },
  { name: "Stripe", desc: "Process payments and manage subscriptions with Stripe.", category: "analytics", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
];

export default function IntegrationsPage() {
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
            <span className="gradient-text">Integrations</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Connect Masidy with the tools you already use. One platform, endless possibilities.
          </motion.p>
        </div>
      </section>

      {/* Category pills */}
      <section className="max-w-6xl mx-auto px-4 pb-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button
              key={c.value}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                c.value === "all"
                  ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30"
                  : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-accent/20"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((intg, i) => (
            <motion.div
              key={intg.name}
              className="bg-app-card border border-app-border rounded-2xl p-6 hover:border-app-accent/30 hover:shadow-lg transition-all cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-app-accent/10 flex items-center justify-center shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={intg.icon}/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors mb-1">{intg.name}</h3>
                  <p className="text-sm text-app-text-muted leading-relaxed">{intg.desc}</p>
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
