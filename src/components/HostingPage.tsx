"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const sites = [
  { name: "masidy.com", status: "Active" },
  { name: "futurist.dev", status: "Deploying" },
  { name: "neonui.app", status: "Offline" },
];

export function HostingPage() {
  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-app-text mb-8">Hosting</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sites.map((site, i) => (
          <motion.div
            key={site.name}
            className="bg-app-card border border-app-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-app-accent/20 transition-all flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4 }}
          >
            <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4.03 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4.03-3-9s1.34-9 3-9"/></svg>
            </div>
            <div className="text-lg font-bold text-app-text mb-1">{site.name}</div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              site.status === "Active" ? "bg-emerald-500/10 text-emerald-500"
              : site.status === "Deploying" ? "bg-amber-500/10 text-amber-500"
              : "bg-red-500/10 text-red-400"
            }`}>{site.status}</span>
            <div className="flex gap-2 w-full mt-auto">
              <Button variant="ghost" className="flex-1 text-app-accent-text px-3 py-1 rounded-full border border-app-border hover:bg-app-accent/10 text-xs">Manage</Button>
              <Button variant="ghost" className="flex-1 text-app-text-secondary px-3 py-1 rounded-full border border-app-border hover:bg-app-accent/10 text-xs">Deploy</Button>
              <Button variant="ghost" className="flex-1 text-app-text-secondary px-3 py-1 rounded-full border border-app-border hover:bg-app-accent/10 text-xs">Settings</Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
