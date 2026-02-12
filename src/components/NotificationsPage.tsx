"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type NotifType = "deploy" | "billing" | "team" | "alert" | "system";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "deploy", title: "Deployment successful", message: "masidy-web deployed to production (v2.4.1)", time: "5 min ago", read: false },
  { id: 2, type: "alert", title: "High CPU usage detected", message: "Server us-east-1 exceeded 90% CPU for 10 minutes", time: "12 min ago", read: false },
  { id: 3, type: "team", title: "New team member", message: "jane@corp.com accepted your invitation", time: "1 hour ago", read: false },
  { id: 4, type: "billing", title: "Invoice generated", message: "Your February invoice for $49.00 is ready", time: "3 hours ago", read: true },
  { id: 5, type: "system", title: "Scheduled maintenance", message: "Database cluster maintenance on Feb 15 at 02:00 UTC", time: "6 hours ago", read: true },
  { id: 6, type: "deploy", title: "Build failed", message: "api-gateway build #342 failed with exit code 1", time: "8 hours ago", read: true },
  { id: 7, type: "team", title: "Role updated", message: "Your role was changed to Admin by admin@masidy.com", time: "1 day ago", read: true },
  { id: 8, type: "alert", title: "SSL Certificate expiring", message: "Certificate for masidy.com expires in 14 days", time: "1 day ago", read: true },
  { id: 9, type: "billing", title: "Payment received", message: "Payment of $49.00 processed successfully", time: "2 days ago", read: true },
  { id: 10, type: "system", title: "Platform update", message: "Masidy v2.4 released with new AI features", time: "3 days ago", read: true },
];

const typeConfig: Record<NotifType, { color: string; icon: string }> = {
  deploy: { color: "bg-indigo-500/10 text-indigo-400", icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" },
  billing: { color: "bg-emerald-500/10 text-emerald-400", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
  team: { color: "bg-purple-500/10 text-purple-400", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  alert: { color: "bg-amber-500/10 text-amber-400", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" },
  system: { color: "bg-cyan-500/10 text-cyan-400", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
};

const filters: { label: string; value: NotifType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Deployments", value: "deploy" },
  { label: "Alerts", value: "alert" },
  { label: "Team", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "System", value: "system" },
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<NotifType | "all">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-app-text">Notifications</h1>
          <p className="text-app-text-muted mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={markAllRead}
            className="px-4 py-2 rounded-xl bg-app-card border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-accent/30 transition-colors text-sm font-medium"
          >
            Mark all as read
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value
                ? "bg-app-accent/15 text-app-accent-text border border-app-accent/30"
                : "bg-app-card border border-app-border text-app-text-secondary hover:text-app-text hover:border-app-accent/20"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((notif, i) => {
            const cfg = typeConfig[notif.type];
            return (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-app-card border rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-all hover:border-app-accent/30 ${
                  notif.read ? "border-app-border/50 opacity-70" : "border-app-border"
                }`}
                onClick={() => toggleRead(notif.id)}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={cfg.icon}/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className={`font-semibold text-sm ${notif.read ? "text-app-text-secondary" : "text-app-text"}`}>{notif.title}</h3>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-app-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-app-text-muted">{notif.message}</p>
                </div>
                <span className="text-xs text-app-text-muted whitespace-nowrap shrink-0">{notif.time}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-app-text-muted">
            No notifications in this category.
          </div>
        )}
      </div>
    </div>
  );
}
