"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";

const tabs = ["Profile", "Security", "API Keys", "Notifications"] as const;

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Profile");

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-app-text mb-8">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border ${
              activeTab === tab
                ? "bg-app-btn-primary text-app-btn-primary-text border-transparent shadow-sm"
                : "bg-app-card text-app-text-secondary border-app-border hover:bg-app-accent/10"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-app-card border border-app-border rounded-2xl p-8 shadow-sm"
      >
        {activeTab === "Profile" && (
          <form className="flex flex-col gap-5">
            <label className="flex flex-col gap-1">
              <span className="text-app-text-secondary text-sm font-medium">Full Name</span>
              <input type="text" defaultValue="Jane Doe" className="rounded-full px-5 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-app-text-secondary text-sm font-medium">Email</span>
              <input type="email" defaultValue="jane@masidy.com" className="rounded-full px-5 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors" />
            </label>
            <Button className="rounded-full bg-app-btn-primary text-app-btn-primary-text font-semibold shadow-sm hover:bg-app-btn-primary-hover transition-colors px-8 py-2 w-max">Save</Button>
          </form>
        )}

        {activeTab === "Security" && (
          <form className="flex flex-col gap-5">
            <label className="flex flex-col gap-1">
              <span className="text-app-text-secondary text-sm font-medium">Current Password</span>
              <input type="password" className="rounded-full px-5 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-app-text-secondary text-sm font-medium">New Password</span>
              <input type="password" className="rounded-full px-5 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors" />
            </label>
            <Button className="rounded-full bg-app-btn-primary text-app-btn-primary-text font-semibold shadow-sm hover:bg-app-btn-primary-hover transition-colors px-8 py-2 w-max">Update Password</Button>
          </form>
        )}

        {activeTab === "API Keys" && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 bg-app-bg rounded-xl border border-app-border">
              <div>
                <div className="text-app-text font-semibold text-sm">Production Key</div>
                <div className="text-app-text-muted text-xs font-mono mt-1">sk_live_****...abcd</div>
              </div>
              <Button variant="ghost" className="text-app-accent-text text-xs border border-app-border rounded-full px-3 py-1 hover:bg-app-accent/10">Reveal</Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-app-bg rounded-xl border border-app-border">
              <div>
                <div className="text-app-text font-semibold text-sm">Test Key</div>
                <div className="text-app-text-muted text-xs font-mono mt-1">sk_test_****...efgh</div>
              </div>
              <Button variant="ghost" className="text-app-accent-text text-xs border border-app-border rounded-full px-3 py-1 hover:bg-app-accent/10">Reveal</Button>
            </div>
            <Button className="rounded-full bg-app-btn-primary text-app-btn-primary-text font-semibold shadow-sm hover:bg-app-btn-primary-hover transition-colors px-6 py-2 w-max mt-2">Generate New Key</Button>
          </div>
        )}

        {activeTab === "Notifications" && (
          <div className="flex flex-col gap-4">
            {["Email Alerts", "Deployment Notifications", "Weekly Reports", "Security Alerts"].map((item) => (
              <label key={item} className="flex items-center justify-between p-4 bg-app-bg rounded-xl border border-app-border cursor-pointer group hover:border-app-accent/20 transition-colors">
                <span className="text-app-text font-medium text-sm">{item}</span>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--app-accent)]" />
              </label>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
