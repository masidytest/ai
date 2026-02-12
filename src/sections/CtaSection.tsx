"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function CtaSection() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section className="w-full py-28 bg-app-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        {/* ── Main CTA Card ── */}
        <motion.div
          className="relative rounded-3xl border border-app-border bg-app-card shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--app-accent-glow),transparent_70%)]" />

          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 lg:px-24 lg:py-24">
            {/* Badge — drops from top */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block px-5 py-1.5 rounded-full text-sm font-bold tracking-widest text-app-accent-text uppercase border border-app-accent/20 bg-app-accent/[0.06]">
                GET STARTED WITH MASIDY
              </span>
            </motion.div>

            {/* Heading — slides from LEFT */}
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-app-text mb-6 text-center leading-tight"
              initial={{ opacity: 0, x: -120 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Ready to replace your<br />entire dev stack?
            </motion.h2>

            {/* Subtitle — slides from RIGHT */}
            <motion.p
              className="text-app-text-secondary text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-center"
              initial={{ opacity: 0, x: 120 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              AI IDE + UI Builder + Workflows + Cloud + Database + Domains.
              Start building for free — no credit card required.
            </motion.p>

            {/* Buttons — slide from LEFT */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a
                href="/dashboard"
                className="px-9 py-4 rounded-xl font-bold text-lg bg-app-btn-primary text-app-btn-primary-text hover:bg-app-btn-primary-hover transition-all shadow-lg shadow-app-accent-glow hover:scale-105"
              >
                Try for Free
              </a>
              <a
                href="/contact"
                className="px-9 py-4 rounded-xl font-bold text-lg border border-app-border text-app-text hover:bg-app-surface transition-all hover:scale-105"
              >
                Talk to us
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Newsletter Card — full width, elements from left & right ── */}
        <motion.div
          className="mt-10 rounded-3xl border border-app-border bg-app-card shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="relative px-8 py-14 md:px-16 md:py-16 lg:px-24 lg:py-20">
            {/* Background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--app-accent-glow),transparent_70%)] opacity-40" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
              {/* Text — slides from LEFT */}
              <motion.div
                className="flex-1 text-center lg:text-left"
                initial={{ opacity: 0, x: -120 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-app-text mb-3">
                  Get the latest from Masidy
                </h3>
                <p className="text-app-text-muted text-lg md:text-xl max-w-lg">
                  Product updates, engineering insights, and early access — straight to your inbox.
                </p>
              </motion.div>

              {/* Form — slides from RIGHT */}
              <motion.form
                className="w-full lg:w-auto flex-shrink-0"
                initial={{ opacity: 0, x: 120 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                  setSubscribed(true);
                  setTimeout(() => setSubscribed(false), 3000);
                }}
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full lg:w-[420px]">
                  <input
                    type="email"
                    className="flex-1 px-6 py-4 rounded-xl border border-app-border bg-app-surface text-app-text placeholder:text-app-text-muted text-lg outline-none focus:border-app-accent focus:ring-2 focus:ring-app-accent/30 transition-all"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-bold text-lg hover:bg-app-btn-primary-hover transition-all whitespace-nowrap hover:scale-105 shadow-lg shadow-app-accent-glow"
                  >
                    {subscribed ? "\u2713 Subscribed!" : "Subscribe"}
                  </button>
                </div>
                <p className="text-xs text-app-text-muted mt-3 text-center lg:text-left">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
