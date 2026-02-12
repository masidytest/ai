"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: handle email submission
    setEmail("");
  }

  return (
    <form
      className="w-full max-w-md mx-auto flex flex-col items-center mt-12"
      onSubmit={handleSubmit}
    >
      <motion.div
        className={`flex w-full items-center rounded-full border-2 px-2 py-2 bg-app-card transition-colors duration-200 ${
          focused ? "border-app-accent shadow-lg" : "border-app-border"
        }`}
        animate={{
          boxShadow: focused
            ? "0 0 12px var(--app-accent), 0 0 24px rgba(6,182,212,0.3)"
            : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="email"
          className="flex-1 bg-transparent outline-none text-lg px-4 py-2 placeholder:text-app-text-muted text-app-text"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
        />
        <button
          type="submit"
          className="ml-2 px-6 py-2 rounded-full bg-app-btn-primary text-app-btn-primary-text font-semibold shadow hover:opacity-90 transition-all duration-200"
        >
          Sign Up
        </button>
      </motion.div>
    </form>
  );
}
