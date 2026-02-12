"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    period: "forever",
    description: "For personal projects and learning",
    cta: "Get Started Free",
    popular: false,
    features: [
      "AI IDE with basic completions",
      "UI Builder (5 pages)",
      "3 workflows",
      "1 cloud deployment",
      "Shared database (500MB)",
      "Community support",
      "1 custom domain",
    ],
  },
  {
    name: "Pro",
    monthly: 49,
    annual: 39,
    period: "/month",
    description: "For devs and small teams shipping fast",
    cta: "Start Pro Trial",
    popular: true,
    features: [
      "Full AI IDE with all 6 engines",
      "Unlimited UI Builder pages",
      "Unlimited workflows",
      "10 cloud deployments",
      "Dedicated database (10GB)",
      "Priority support",
      "Custom domains with SSL",
      "GitHub/GitLab/Bitbucket sync",
      "Webhooks & API access",
      "Team collaboration (5 seats)",
    ],
  },
  {
    name: "Enterprise",
    monthly: -1,
    annual: -1,
    period: "",
    description: "For orgs that need full control and compliance",
    cta: "Contact Sales",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited deployments & databases",
      "Dedicated VPS infrastructure",
      "SOC 2 & HIPAA compliance",
      "SSO/SAML authentication",
      "Audit trail & governance",
      "Role-based access control (RBAC)",
      "Custom integrations & SLA",
      "Dedicated account manager",
      "On-premise option available",
    ],
  },
];

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="w-full py-28 bg-app-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
            PRICING
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-app-text mb-5">
            Start free, scale as you grow
          </h2>
          <p className="text-app-text-secondary text-xl max-w-xl mx-auto">
            No credit card required. Upgrade when you&apos;re ready.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-14"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <span className={`text-sm font-semibold transition-colors ${!isAnnual ? "text-app-text" : "text-app-text-muted"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full bg-app-surface border border-app-border transition-colors focus:outline-none"
            aria-label="Toggle annual pricing"
          >
            <motion.div
              className="absolute top-0.5 w-6 h-6 rounded-full bg-app-btn-primary shadow-md"
              animate={{ left: isAnnual ? 30 : 2 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${isAnnual ? "text-app-text" : "text-app-text-muted"}`}>
            Annual
          </span>
          <AnimatePresence>
            {isAnnual && (
              <motion.span
                className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                initial={{ opacity: 0, scale: 0.8, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                Save 20%
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => {
            const price = plan.monthly === -1 ? "Custom" : `$${isAnnual ? plan.annual : plan.monthly}`;
            const isPopular = plan.popular;
            const fromDir = i === 0 ? -80 : i === 2 ? 80 : 0;

            return (
              <motion.div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                  isPopular
                    ? "border-app-accent/40 bg-app-card shadow-xl shadow-app-accent/10 scale-[1.02] z-10"
                    : "border-app-border bg-app-card shadow-sm hover:shadow-md"
                }`}
                initial={{ opacity: 0, x: fromDir, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {isPopular && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full text-xs font-bold bg-app-btn-primary text-white shadow-lg shadow-app-accent-glow">
                        Most Popular
                      </span>
                    </div>
                    {/* Glow ring */}
                    <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top,var(--app-accent-glow),transparent_60%)] pointer-events-none" />
                  </>
                )}

                <div className="relative z-10 mb-6">
                  <h3 className="text-2xl font-bold text-app-text mb-1">{plan.name}</h3>
                  <p className="text-base text-app-text-muted mb-5">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={price}
                        className="text-5xl font-extrabold text-app-text"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        {price}
                      </motion.span>
                    </AnimatePresence>
                    {plan.period && (
                      <span className="text-app-text-muted text-sm">{plan.period}</span>
                    )}
                  </div>
                  {isAnnual && plan.monthly > 0 && (
                    <motion.p
                      className="text-xs text-emerald-400 mt-1 font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      ${plan.annual * 12}/year (save ${(plan.monthly - plan.annual) * 12}/yr)
                    </motion.p>
                  )}
                </div>

                <a
                  href={plan.cta === "Contact Sales" ? "/contact" : "/dashboard"}
                  className={`relative z-10 w-full text-center py-3.5 rounded-xl font-bold text-sm transition-all block hover:scale-[1.02] ${
                    isPopular
                      ? "bg-app-btn-primary text-app-btn-primary-text hover:bg-app-btn-primary-hover shadow-lg shadow-app-accent-glow"
                      : "border border-app-border text-app-text hover:bg-app-card"
                  } mb-8`}
                >
                  {plan.cta}
                </a>

                <ul className="relative z-10 space-y-3 flex-1">
                  {plan.features.map((feature, fi) => (
                    <motion.li
                      key={feature}
                      className="flex items-start gap-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + fi * 0.04 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
                        <path d="M20 6L9 17l-5-5" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-base text-app-text-secondary">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
