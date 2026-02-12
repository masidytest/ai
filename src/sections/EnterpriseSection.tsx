"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const features = [
  {
    icon: "shield",
    title: "Enterprise Security",
    desc: "SOC 2 Type II compliant. End-to-end encryption at rest and in transit. Pen-tested quarterly.",
    color: "#818cf8",
  },
  {
    icon: "lock",
    title: "Roles & Permissions",
    desc: "Granular role-based access control. Define custom roles, scoped per project or org-wide.",
    color: "#a855f7",
  },
  {
    icon: "workflow",
    title: "Rules & Workflows",
    desc: "Enforce code review gates, auto-deploy pipelines, and compliance workflows across all teams.",
    color: "#f59e0b",
  },
  {
    icon: "data",
    title: "Data Privacy",
    desc: "Your data never trains our models. GDPR, HIPAA ready. Deploy on-prem or in your own cloud.",
    color: "#10b981",
  },
  {
    icon: "audit",
    title: "Audit Trail",
    desc: "Full activity logging with immutable audit trail. Track every change, deploy, and access event.",
    color: "#22d3ee",
  },
  {
    icon: "sso",
    title: "SSO & SAML",
    desc: "Single sign-on with Okta, Azure AD, Google Workspace. SCIM provisioning for automatic onboarding.",
    color: "#6366f1",
  },
];

const icons: Record<string, (c: string) => React.ReactNode> = {
  shield: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  lock: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  workflow: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
    </svg>
  ),
  data: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  audit: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M9 15l2 2 4-4" />
    </svg>
  ),
  sso: (c) => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
};

export function EnterpriseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !timerRef.current) {
          timerRef.current = setInterval(() => {
            setActiveCard((p) => (p + 1) % features.length);
          }, 2500);
        }
        if (!e.isIntersecting && timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} id="enterprise" className="w-full py-28 bg-app-bg-secondary overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
            ENTERPRISE
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-app-text mb-5">
            Built for teams shipping at scale
          </h2>
          <p className="text-app-text-secondary text-xl max-w-2xl mx-auto">
            Security, compliance, and governance baked into every layer — not bolted on after.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-14">
          {features.map((feature, i) => {
            const isActive = i === activeCard;
            const fromRight = i % 2 === 1;
            return (
              <motion.div
                key={feature.title}
                className={`relative p-7 rounded-2xl border transition-all duration-500 cursor-default ${
                  isActive
                    ? "border-white/[0.15] bg-white/[0.04] shadow-xl"
                    : "border-app-border bg-app-card shadow-sm hover:border-white/[0.1]"
                }`}
                initial={{ opacity: 0, x: fromRight ? 80 : -80 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  boxShadow: isActive ? `0 0 40px ${feature.color}15, 0 0 80px ${feature.color}08` : undefined,
                }}
              >
                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    className="absolute top-0 left-6 right-6 h-[2px] rounded-full"
                    style={{ background: feature.color }}
                    layoutId="enterprise-active"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-colors duration-500"
                  style={{
                    background: feature.color + (isActive ? "20" : "10"),
                    boxShadow: isActive ? `0 0 20px ${feature.color}25` : undefined,
                  }}
                >
                  {icons[feature.icon](feature.color)}
                </div>

                <h3 className="text-xl font-bold text-app-text mb-2">{feature.title}</h3>
                <p className="text-app-text-secondary text-base leading-relaxed">{feature.desc}</p>

                {/* Progress bar for active card */}
                {isActive && (
                  <motion.div className="mt-5 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: feature.color }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "linear" }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <a
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-lg bg-app-btn-primary text-app-btn-primary-text hover:bg-app-btn-primary-hover transition-all shadow-lg shadow-app-accent-glow hover:scale-105"
          >
            Talk to Sales
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <p className="text-sm text-app-text-muted mt-4">
            Custom pricing for teams of 10+. Free migration from any platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
