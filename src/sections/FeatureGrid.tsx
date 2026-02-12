import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M14 8v6l4 2" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature One",
    desc: "Short description for feature one.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="5" y="5" width="18" height="18" rx="5" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M10 14h8" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Two",
    desc: "Short description for feature two.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="7" y="7" width="14" height="14" rx="3" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M14 11v6" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Three",
    desc: "Short description for feature three.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M9 14l4 4 6-6" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Four",
    desc: "Short description for feature four.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="5" y="5" width="18" height="18" rx="5" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M14 9v10" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Five",
    desc: "Short description for feature five.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="7" y="7" width="14" height="14" rx="3" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M11 14h6" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Six",
    desc: "Short description for feature six.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M14 10v8" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Seven",
    desc: "Short description for feature seven.",
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 28 28"><rect x="5" y="5" width="18" height="18" rx="5" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M9 14h10" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Feature Eight",
    desc: "Short description for feature eight.",
  },
];

export function FeatureGrid() {
  return (
    <section className="w-full max-w-6xl mx-auto py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold neon-text text-center mb-14">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            className="bg-app-card border border-app-border rounded-2xl p-6 flex flex-col items-center text-center shadow-lg transition-colors"
            whileHover={{ y: -8, boxShadow: "0 0 16px var(--app-accent), 0 0 32px #06b6d4" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold text-app-text mb-2">{feature.title}</h3>
            <p className="text-app-text-secondary text-base min-h-[40px]">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
