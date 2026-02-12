import { motion } from "framer-motion";

const steps = [
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M16 10v8l5 3" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Describe Your Idea",
    desc: "Share your vision in a sentence or two.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="6" y="6" width="20" height="20" rx="6" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M12 16h8" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Choose Components",
    desc: "Select from a library of modern UI blocks.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><rect x="8" y="8" width="16" height="16" rx="4" className="stroke-app-icon-primary" strokeWidth="2"/><path d="M16 12v8" className="stroke-app-icon-secondary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Customize & Animate",
    desc: "Tweak styles, add motion, and preview live.",
  },
  {
    icon: (
      <svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" className="stroke-app-icon-secondary" strokeWidth="2"/><path d="M10 16l4 4 8-8" className="stroke-app-icon-primary" strokeWidth="2" strokeLinecap="round"/></svg>
    ),
    title: "Launch Instantly",
    desc: "Deploy your app with a single click.",
  },
];

export function HowItWorks() {
  return (
    <section className="w-full max-w-5xl mx-auto py-20 px-4">
      <h2 className="text-3xl md:text-4xl font-bold neon-text text-center mb-14">How It Works</h2>
      <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-10 md:gap-0 relative">
        {steps.map((step, i) => (
          <div key={step.title} className="flex-1 flex flex-col items-center text-center relative px-2">
            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {step.icon}
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-app-text">{step.title}</h3>
            <p className="text-app-text-secondary text-base mb-2 min-h-[40px]">{step.desc}</p>
            {/* Divider except last */}
            {i < steps.length - 1 && (
              <div
                className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-20 w-px bg-gradient-to-b from-app-accent/60 via-cyan-500/40 to-transparent blur-sm"
                style={{ left: '100%' }}
              />
            )}
            {i < steps.length - 1 && (
              <div
                className="block md:hidden w-32 h-px mx-auto mt-6 bg-gradient-to-r from-app-accent/60 via-cyan-500/40 to-transparent blur-sm"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
