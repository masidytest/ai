import React from "react";
import { motion } from "framer-motion";

const actions = [
  {
    label: "Connect Repo",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><path className="stroke-app-icon-primary" strokeWidth="2" d="M7 7v10m10-10v10M5 12h14"/></svg>
    ),
  },
  {
    label: "Import Design",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><circle cx="12" cy="12" r="8" className="stroke-app-icon-secondary" strokeWidth="2"/><path className="stroke-app-icon-primary" strokeWidth="2" d="M8 12h8"/></svg>
    ),
  },
  {
    label: "Add API",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><rect x="4" y="8" width="16" height="8" rx="4" className="stroke-app-icon-secondary" strokeWidth="2"/><path className="stroke-app-icon-primary" strokeWidth="2" d="M12 8v8"/></svg>
    ),
  },
  {
    label: "Open Builder",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><rect x="6" y="6" width="12" height="12" rx="3" className="stroke-app-icon-primary" strokeWidth="2"/><path className="stroke-app-icon-secondary" strokeWidth="2" d="M9 9h6v6H9z"/></svg>
    ),
  },
  {
    label: "Start Workflow",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><circle cx="12" cy="12" r="9" className="stroke-app-icon-primary" strokeWidth="2"/><path className="stroke-app-icon-secondary" strokeWidth="2" d="M12 7v5l4 2"/></svg>
    ),
  },
  {
    label: "Create App",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="mr-2"><rect x="4" y="4" width="16" height="16" rx="4" className="stroke-app-icon-secondary" strokeWidth="2"/><path className="stroke-app-icon-primary" strokeWidth="2" d="M12 8v8M8 12h8"/></svg>
    ),
  },
];

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-8">
      {actions.map((action) => (
        <motion.button
          key={action.label}
          whileHover={{ scale: 1.08, boxShadow: "0 0 12px var(--app-accent), 0 0 24px rgba(6,182,212,0.4)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center px-5 py-2 rounded-full bg-app-card border border-app-border text-app-text font-medium text-base transition-colors duration-200 shadow hover:bg-app-accent/10 focus:outline-none"
        >
          {action.icon}
          {action.label}
        </motion.button>
      ))}
    </div>
  );
}
