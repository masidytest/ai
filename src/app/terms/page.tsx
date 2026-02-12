"use client";

import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using Masidy's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our platform. These terms apply to all users, including visitors, registered users, and paying subscribers." },
  { title: "Account Registration", content: "To access certain features, you must create an account with accurate, complete information. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms." },
  { title: "Subscription & Billing", content: "Paid subscriptions are billed in advance on a monthly or annual basis. You authorize us to charge your payment method at the start of each billing period. Prices may change with 30 days notice. Refunds are available within 14 days of initial purchase. Failure to pay may result in service suspension." },
  { title: "Acceptable Use", content: "You agree not to use our services to: (a) violate any laws or regulations, (b) infringe on intellectual property rights, (c) distribute malware or harmful code, (d) attempt to gain unauthorized access to systems, (e) engage in abusive or fraudulent activity, (f) send unsolicited communications, or (g) interfere with other users' access to the platform." },
  { title: "Intellectual Property", content: "The platform, including its design, features, code, and documentation, is owned by Masidy and protected by intellectual property laws. Your subscription grants a limited, non-exclusive, non-transferable license to use the platform. Content you create using our tools remains your property, but you grant us a license to host and serve it." },
  { title: "User Content", content: "You retain ownership of code, data, and content you upload to the platform. You are solely responsible for your content and must ensure it does not violate any laws or third-party rights. We may remove content that violates these terms. You grant us the right to store, process, and display your content as necessary to provide our services." },
  { title: "Service Availability", content: "We strive for 99.9% uptime but do not guarantee uninterrupted access. Scheduled maintenance will be communicated in advance. We are not liable for downtime caused by factors beyond our control, including internet outages, third-party service failures, or force majeure events." },
  { title: "Limitation of Liability", content: "To the maximum extent permitted by law, Masidy shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data, or business opportunities. Our total liability for any claim shall not exceed the amount paid by you in the 12 months preceding the claim." },
  { title: "Indemnification", content: "You agree to indemnify, defend, and hold harmless Masidy, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the platform, violation of these terms, or infringement of any third-party rights." },
  { title: "Termination", content: "Either party may terminate this agreement at any time. Upon termination, your access to the platform will cease. You may export your data within 30 days of termination. We may retain anonymized data for analytics. Sections regarding intellectual property, limitation of liability, and indemnification survive termination." },
  { title: "Governing Law", content: "These terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association, unless you qualify for small claims court." },
  { title: "Changes to Terms", content: "We reserve the right to modify these terms at any time. Material changes will be communicated via email or platform notification at least 30 days before taking effect. Continued use of the platform after changes constitutes acceptance of the updated terms." },
];

export default function TermsPage() {
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
            <span className="gradient-text">Terms of Service</span>
          </motion.h1>
          <motion.p
            className="text-lg text-app-text-muted max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Please read these terms carefully before using the Masidy platform.
          </motion.p>
          <motion.p
            className="text-sm text-app-text-muted mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Effective date: June 15, 2025
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
          <h2 className="text-lg font-semibold text-app-text mb-3">Questions?</h2>
          <p className="text-sm text-app-text-muted leading-relaxed">
            If you have questions about these Terms of Service, please{" "}
            <a href="/contact" className="text-app-accent-text hover:underline">contact us</a>.
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
