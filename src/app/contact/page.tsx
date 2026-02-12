"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "../../components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <main className="min-h-screen bg-app-bg px-4 pt-24 pb-20">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-app-text mb-3">Contact Us</h1>
          <p className="text-app-text-secondary mb-10">Have a question, partnership idea, or enterprise inquiry? We&apos;d love to hear from you.</p>

          <form
            className="bg-app-card border border-app-border rounded-2xl p-8 shadow-lg space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="block">
              <span className="text-sm font-medium text-app-text-secondary mb-1.5 block">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-app-text-secondary mb-1.5 block">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-app-text-secondary mb-1.5 block">Message</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you need..."
                rows={5}
                className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors resize-none"
              />
            </label>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-bold text-sm hover:bg-app-btn-primary-hover transition-colors shadow-lg shadow-app-accent-glow"
            >
              Send Message
            </button>
          </form>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
            <div className="bg-app-card border border-app-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </div>
              <div className="text-xs text-app-text-muted mb-1">Email</div>
              <a href="mailto:contact@masidy.com" className="text-sm text-app-accent-text hover:underline font-medium">contact@masidy.com</a>
            </div>
            <div className="bg-app-card border border-app-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <div className="text-xs text-app-text-muted mb-1">Location</div>
              <div className="text-sm text-app-text font-medium">San Francisco, CA</div>
            </div>
            <div className="bg-app-card border border-app-border rounded-xl p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mx-auto mb-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div className="text-xs text-app-text-muted mb-1">Support Hours</div>
              <div className="text-sm text-app-text font-medium">Mon–Fri, 9am–6pm PT</div>
            </div>
          </div>
          <p className="text-xs text-app-text-muted text-center mt-4">
            For support inquiries, email <a href="mailto:support@masidy.com" className="text-app-accent-text hover:underline">support@masidy.com</a>. 
            For sales, reach us at <a href="mailto:sales@masidy.com" className="text-app-accent-text hover:underline">sales@masidy.com</a>.
          </p>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
