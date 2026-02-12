"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "What is Masidy and how does it work?",
    a: "Masidy is an AI-powered all-in-one development platform. Describe what you want to build in plain English, and our AI generates production-ready code, databases, APIs, and deploys everything to the cloud — all from a single prompt.",
  },
  {
    q: "Do I need coding experience to use Masidy?",
    a: "Not at all. Masidy is built for everyone — from non-technical founders who want to ship an MVP, to senior engineers who want to move 10x faster. The Visual UI Builder and AI prompts handle the heavy lifting.",
  },
  {
    q: "What's included in the Free plan?",
    a: "The Free plan includes the AI IDE, Visual UI Builder, Workflow Automation, 1 cloud project, a managed database, and a free subdomain. No credit card required — build and deploy your first app in minutes.",
  },
  {
    q: "Can I bring my own codebase?",
    a: "Yes. Import any GitHub, GitLab, or Bitbucket repo directly into Masidy. Our AI understands your existing code structure and can refactor, extend, or deploy it to our cloud infrastructure.",
  },
  {
    q: "How does pricing compare to using separate tools?",
    a: "Most teams pay $200–$500/mo for a stack of Cursor, Vercel, Supabase, n8n, and Cloudflare. Masidy replaces all of them for $49/mo on the Pro plan — one bill, one platform, zero integration headaches.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. All data is encrypted at rest and in transit. We offer SOC 2 compliance, role-based access control, audit logs, and the option to deploy on your own infrastructure with the Enterprise plan.",
  },
  {
    q: "Can I deploy to my own cloud provider?",
    a: "Yes. While Masidy includes managed cloud hosting, Enterprise customers can deploy to AWS, GCP, or Azure using our bring-your-own-cloud option. Full control, zero lock-in.",
  },
  {
    q: "What integrations does Masidy support?",
    a: "Masidy integrates with GitHub, GitLab, Bitbucket, Slack, Discord, Notion, Stripe, AWS, Figma, Linear, Jira, and more. Our API gateway also lets you connect any external service.",
  },
];

function FaqItem({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) {
  const fromRight = index % 2 === 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: fromRight ? 120 : -120 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      className={`rounded-2xl border border-app-border bg-app-card shadow-lg hover:border-white/[0.12] transition-colors ${
        isOpen ? "ring-1 ring-app-accent/30" : ""
      }`}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-7 py-7 md:px-9 md:py-8 text-left group"
      >
        <div className="flex items-center gap-4 pr-6">
          <span
            className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: `hsl(${230 + index * 18}, 70%, 55%)`,
              color: "#fff",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-xl md:text-2xl font-semibold text-app-text group-hover:text-app-accent transition-colors">
            {faq.q}
          </span>
        </div>
        <span
          className={`shrink-0 w-9 h-9 rounded-full border border-app-border flex items-center justify-center transition-all duration-300 ${
            isOpen
              ? "bg-app-accent border-app-accent rotate-45"
              : "bg-transparent"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isOpen ? "white" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-7 pb-7 md:px-9 md:pb-8 pl-[4.5rem] md:pl-[5.25rem] text-app-text-secondary text-lg md:text-xl leading-relaxed">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-24 bg-app-bg-secondary overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-bold tracking-widest text-app-accent-text uppercase mb-3 block">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-app-text mb-5">
            Frequently asked questions
          </h2>
          <p className="text-app-text-secondary text-xl">
            Everything you need to know about Masidy.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <FaqItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
