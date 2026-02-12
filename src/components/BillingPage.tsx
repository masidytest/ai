"use client";

import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const invoices = [
  { id: "INV-001", date: "2026-02-01", amount: "$49.00", status: "Paid" },
  { id: "INV-002", date: "2026-01-01", amount: "$49.00", status: "Paid" },
  { id: "INV-003", date: "2025-12-01", amount: "$49.00", status: "Due" },
];

const tiers = [
  { name: "Starter", price: "$0/mo", features: ["1 Project", "Community Support", "Basic Analytics"] },
  { name: "Pro", price: "$49/mo", features: ["10 Projects", "Priority Support", "Advanced Analytics"] },
  { name: "Enterprise", price: "Contact Us", features: ["Unlimited Projects", "Dedicated Support", "Custom Integrations"] },
];

export function BillingPage() {
  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Usage summary */}
      <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Projects", value: "7" },
          { label: "Team Members", value: "12" },
          { label: "Current Plan", value: "Pro" },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="bg-app-card border border-app-border rounded-2xl p-6 shadow-sm hover:shadow-lg hover:border-app-accent/20 transition-all"
            whileHover={{ y: -4 }}
          >
            <div className="text-app-accent-text font-semibold mb-1 text-sm">{stat.label}</div>
            <div className="text-2xl font-bold text-app-text">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Payment method + Invoices */}
      <div className="mb-10 flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-app-card border border-app-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="text-app-accent-text font-semibold mb-3 text-sm">Payment Method</div>
          <div className="flex items-center gap-4 mb-3">
            <div className="w-10 h-6 rounded bg-app-accent/20 flex items-center justify-center">
              <svg width="20" height="14" viewBox="0 0 24 16" fill="none" stroke="var(--app-accent)" strokeWidth="1.5" strokeLinecap="round"><rect x="1" y="1" width="22" height="14" rx="2"/><line x1="1" y1="6" x2="23" y2="6"/></svg>
            </div>
            <span className="text-app-text font-mono text-sm">**** 4242</span>
          </div>
          <Button variant="ghost" className="text-app-accent-text px-3 py-1 rounded-full border border-app-border hover:bg-app-accent/10 w-max text-sm">Update</Button>
        </div>

        <div className="flex-1 bg-app-card border border-app-border rounded-2xl p-6 shadow-sm overflow-x-auto">
          <div className="text-app-accent-text font-semibold mb-3 text-sm">Invoices</div>
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-app-text-muted border-b border-app-border">
                <th className="px-4 py-2 font-medium">ID</th>
                <th className="px-4 py-2 font-medium">Date</th>
                <th className="px-4 py-2 font-medium">Amount</th>
                <th className="px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <motion.tr
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="border-b border-app-border/50 hover:bg-app-accent/5 transition-colors"
                >
                  <td className="px-4 py-2.5 font-semibold text-app-text">{inv.id}</td>
                  <td className="px-4 py-2.5 text-app-text-secondary">{inv.date}</td>
                  <td className="px-4 py-2.5 text-app-text-secondary">{inv.amount}</td>
                  <td className="px-4 py-2.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${inv.status === "Paid" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>{inv.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing tiers */}
      <div className="mb-10">
        <div className="text-app-accent-text font-semibold mb-4 text-sm">Compare Plans</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              className="bg-app-card border border-app-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:border-app-accent/20 transition-all"
              whileHover={{ y: -4 }}
            >
              <div className="text-xl font-bold text-app-text mb-2">{tier.name}</div>
              <div className="text-2xl font-bold gradient-text mb-4">{tier.price}</div>
              <ul className="mb-6 space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="text-app-text-secondary text-sm flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="rounded-full bg-app-btn-primary text-app-btn-primary-text font-semibold shadow-sm hover:bg-app-btn-primary-hover transition-colors px-6 py-2 w-full">
                {tier.name === "Enterprise" ? "Contact Sales" : "Choose"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
