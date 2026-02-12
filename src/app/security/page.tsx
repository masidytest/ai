"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const features = [
  { title: "SOC 2 Type II Certified", desc: "Independently audited controls for security, availability, and confidentiality across the entire Masidy infrastructure.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Encryption at Rest & Transit", desc: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Zero plaintext storage for sensitive data.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
  { title: "Role-Based Access Control", desc: "Granular RBAC with team roles, project-level permissions, and audit trails for every action.", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { title: "Two-Factor Authentication", desc: "Enforce 2FA across your organization with TOTP, WebAuthn, and recovery code support.", icon: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" },
  { title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation with automatic traffic filtering and rate limiting on all endpoints.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { title: "Vulnerability Scanning", desc: "Automated dependency scanning, container image analysis, and code security review on every deploy.", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
];

const compliance = [
  { label: "SOC 2 Type II", status: "Certified" },
  { label: "GDPR", status: "Compliant" },
  { label: "HIPAA", status: "Eligible" },
  { label: "ISO 27001", status: "In Progress" },
  { label: "CCPA", status: "Compliant" },
  { label: "PCI DSS", status: "Level 1" },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-app-bg text-app-text">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-app-accent/5 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            SOC 2 Type II Certified
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Security at <span className="gradient-text">Masidy</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Your code, data, and infrastructure are protected by enterprise-grade security at every layer. We take security as seriously as you do.
          </motion.p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-app-card border border-app-border rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon}/></svg>
              </div>
              <h3 className="font-semibold text-app-text mb-2">{f.title}</h3>
              <p className="text-sm text-app-text-muted leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Compliance */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-center mb-10">Compliance & Certifications</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {compliance.map((c, i) => (
            <motion.div
              key={c.label}
              className="bg-app-card border border-app-border rounded-xl p-5 text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <h3 className="font-semibold text-app-text mb-1">{c.label}</h3>
              <span className="text-sm text-emerald-500 font-medium">{c.status}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Have security questions?</h2>
        <p className="text-app-text-muted mb-6">Our security team is available to answer questions, review our practices, and provide compliance documentation.</p>
        <a href="/contact" className="inline-block px-6 py-3 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors">
          Contact Security Team
        </a>
      </section>

      <Footer />
    </div>
  );
}
