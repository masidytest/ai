import { motion } from "framer-motion";

function MockWindow({ title, children, className, style }: any) {
  return (
    <motion.div
      className={`relative rounded-2xl bg-app-card border border-app-border shadow-lg neon-border p-6 min-w-[260px] min-h-[160px] ${className}`}
      style={{ boxShadow: "0 4px 32px 0 color-mix(in srgb, var(--app-accent) 25%, transparent), 0 0 24px 2px rgba(6,182,212,0.2)", ...style }}
    >
      <div className="absolute -top-4 left-6 px-3 py-1 rounded-full bg-app-btn-primary text-app-btn-primary-text text-xs font-semibold shadow-lg">
        {title}
      </div>
      {children}
    </motion.div>
  );
}

export function VisualPreview() {
  return (
    <section className="relative w-full flex flex-col items-center justify-center py-24 px-4 overflow-x-hidden">
      <h2 className="text-3xl md:text-4xl font-bold neon-text text-center mb-14">Visual Preview</h2>
      <div className="relative w-full flex items-center justify-center min-h-[340px]">
        {/* Builder Interface */}
        <motion.div
          initial={{ y: 40, x: -60, rotate: -6, opacity: 0 }}
          animate={{ y: 0, x: 0, rotate: -6, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="z-20"
        >
          <MockWindow title="Builder Interface">
            <div className="h-16 w-40 bg-gradient-to-r from-app-accent/20 to-cyan-500/20 rounded-lg mb-2" />
            <div className="h-4 w-32 bg-app-accent/15 rounded mb-1" />
            <div className="h-4 w-28 bg-cyan-500/15 rounded" />
          </MockWindow>
        </motion.div>
        {/* Workflow Canvas */}
        <motion.div
          initial={{ y: -30, x: 0, rotate: 3, opacity: 0 }}
          animate={{ y: 0, x: 0, rotate: 3, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="z-10 -ml-10 md:-ml-24"
        >
          <MockWindow title="Workflow Canvas">
            <div className="flex gap-2 mb-2">
              <div className="h-8 w-8 bg-app-accent/30 rounded-full" />
              <div className="h-8 w-8 bg-cyan-500/30 rounded-full" />
              <div className="h-8 w-8 bg-app-accent/30 rounded-full" />
            </div>
            <div className="h-3 w-24 bg-app-accent/15 rounded mb-1" />
            <div className="h-3 w-20 bg-cyan-500/15 rounded" />
          </MockWindow>
        </motion.div>
        {/* Cloud Dashboard */}
        <motion.div
          initial={{ y: 60, x: 60, rotate: 8, opacity: 0 }}
          animate={{ y: 0, x: 0, rotate: 8, opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="z-0 -ml-10 md:-ml-32"
        >
          <MockWindow title="Cloud Dashboard">
            <div className="h-8 w-32 bg-gradient-to-r from-cyan-500/20 to-app-accent/20 rounded mb-2" />
            <div className="h-3 w-20 bg-app-accent/15 rounded mb-1" />
            <div className="h-3 w-16 bg-cyan-500/15 rounded" />
          </MockWindow>
        </motion.div>
      </div>
    </section>
  );
}
