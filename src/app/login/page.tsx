"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center bg-app-bg px-4 pt-20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-app-text mb-2">Welcome back</h1>
          <p className="text-app-text-secondary">Sign in to your Masidy account</p>
        </div>

        <form
          className="bg-app-card border border-app-border rounded-2xl p-8 shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <label className="block mb-5">
            <span className="text-sm font-medium text-app-text-secondary mb-1.5 block">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors"
            />
          </label>

          <label className="block mb-6">
            <span className="text-sm font-medium text-app-text-secondary mb-1.5 block">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:border-app-accent/40 outline-none text-sm transition-colors"
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-bold text-sm hover:bg-app-btn-primary-hover transition-colors shadow-lg shadow-app-accent-glow"
          >
            Sign in
          </button>

          <div className="flex items-center justify-between mt-5 text-sm">
            <Link href="/signup" className="text-app-accent-text hover:underline">
              Create account
            </Link>
            <a href="/contact" className="text-app-text-muted hover:text-app-text transition-colors">
              Forgot password?
            </a>
          </div>
        </form>

        <p className="text-center text-xs text-app-text-muted mt-6">
          By signing in you agree to our{" "}
          <Link href="/terms" className="text-app-accent-text hover:underline">Terms</Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-app-accent-text hover:underline">Privacy Policy</Link>.
        </p>
      </motion.div>
    </main>
  );
}
