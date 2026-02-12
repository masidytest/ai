"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const suggestionsList = [
  "Create a landing page",
  "Add a pricing section",
  "Build a contact form",
  "Generate a blog layout",
  "Design a dashboard UI",
];

export function AiCommandBox() {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const filteredSuggestions =
    input.length > 0
      ? suggestionsList.filter((s) =>
          s.toLowerCase().includes(input.toLowerCase())
        )
      : [];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  }

  function handleFocus() {
    setFocused(true);
    setShowSuggestions(input.length > 0);
  }

  function handleBlur() {
    setFocused(false);
    setTimeout(() => setShowSuggestions(false), 100); // allow click
  }

  function handleSuggestionClick(s: string) {
    setInput(s);
    setShowSuggestions(false);
    // handleSubmit(s); // Uncomment to trigger handler
  }

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;
    // Navigate to AI IDE with the prompt as a query parameter
    const prompt = encodeURIComponent(input.trim());
    router.push(`/dashboard/ai-ide?prompt=${prompt}`);
    setInput("");
    setShowSuggestions(false);
  }

  return (
    <form
      className="w-full max-w-xl mx-auto mt-12 relative"
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <motion.div
        className={`flex items-center bg-app-card rounded-2xl shadow-lg px-2 py-2 transition-colors duration-200 border-2 ${
          focused ? "border-app-accent shadow-lg" : "border-app-border"
        }`}
        animate={{
          boxShadow: focused
            ? "0 0 16px 2px var(--app-accent), 0 0 32px 4px rgba(6,182,212,0.3)"
            : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.3 }}
      >
        <input
          ref={inputRef}
          type="text"
          className="flex-1 bg-transparent outline-none text-2xl px-4 py-4 placeholder:text-app-text-muted text-app-text"
          placeholder="Tell the platform what to build…"
          value={input}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          type="button"
          tabIndex={-1}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text font-semibold shadow hover:opacity-90 transition-all duration-200"
        >
          + Attach
        </button>
      </motion.div>
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.ul
            className="absolute left-0 right-0 mt-2 bg-app-card border border-app-border rounded-xl shadow-lg z-20 overflow-hidden"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {filteredSuggestions.map((s) => (
              <li
                key={s}
                className="px-6 py-3 cursor-pointer hover:bg-app-accent/10 text-left text-lg text-app-text transition-colors"
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </form>
  );
}
