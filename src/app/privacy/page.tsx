"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const sections = [
  { title: "Information We Collect", content: "We collect information you provide directly, such as your name, email address, and payment information when you create an account or subscribe to our services. We also automatically collect usage data including IP addresses, browser type, device information, and interaction patterns to improve our platform." },
  { title: "How We Use Your Information", content: "Your information is used to provide and maintain our services, process transactions, send service-related communications, improve our platform, personalize your experience, and ensure security. We may also use aggregated, anonymized data for analytics and product development." },
  { title: "Data Storage & Security", content: "Your data is stored on secure servers with industry-standard encryption both at rest and in transit. We implement SOC 2 Type II compliant security practices, conduct regular security audits, and maintain strict access controls. All payment information is processed through PCI DSS compliant providers." },
  { title: "Third-Party Services", content: "We may share limited information with trusted third-party service providers who assist in operating our platform, including cloud hosting providers, payment processors, analytics services, and customer support tools. These providers are contractually bound to protect your data." },
  { title: "Cookies & Tracking", content: "We use essential cookies required for platform functionality, analytics cookies to understand usage patterns, and preference cookies to remember your settings. You can manage cookie preferences at any time through your browser settings or our cookie management panel." },
  { title: "Your Rights & Choices", content: "You have the right to access, correct, export, or delete your personal data. You can opt out of marketing communications, restrict data processing, and request data portability. For EU residents, additional rights under GDPR apply. California residents have rights under the CCPA." },
  { title: "Data Retention", content: "We retain your personal data for as long as your account is active or as needed to provide services. After account deletion, we may retain anonymized data for analytics. Backup data is purged within 90 days. Legal and compliance data may be retained as required by law." },
  { title: "International Transfers", content: "If you access our services outside the United States, your data may be transferred to and processed in the US or other countries. We use Standard Contractual Clauses and other safeguards to ensure adequate protection of your data during international transfers." },
  { title: "Children's Privacy", content: "Our services are not directed to individuals under 16. We do not knowingly collect personal information from children. If we learn that we have collected data from a child, we will promptly delete it." },
  { title: "Changes to This Policy", content: "We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page and, where appropriate, by email. Your continued use of the platform after changes constitutes acceptance." },
];

export default function PrivacyPage() {
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
            <span className="gradient-text">Privacy Policy</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Your privacy matters to us. This policy explains how we collect, use, and protect your data.
          </motion.p>
          <motion.p
            className="text-sm text-app-text-muted mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Last updated: June 15, 2025
          </motion.p>
        </div>
      </section>

      {/* Sections */}
      <section className="max-w-3xl mx-auto px-4 py-8 pb-20 space-y-8">
        {sections.map((s, i) => (
          <motion.div
            key={s.title}
            className="bg-app-card border border-app-border rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
          >
            <h2 className="text-lg font-semibold text-app-text mb-3">{i + 1}. {s.title}</h2>
            <p className="text-sm text-app-text-muted leading-relaxed">{s.content}</p>
          </motion.div>
        ))}

        <motion.div
          className="bg-app-card border border-app-border rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-lg font-semibold text-app-text mb-3">Contact Us</h2>
          <p className="text-sm text-app-text-muted leading-relaxed">
            If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us at{" "}
            <a href="/contact" className="text-app-accent-text hover:underline">our contact page</a>{" "}
            or email privacy@masidy.com.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
