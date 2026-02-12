"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACTIONS = [
  { label: "Run", value: "run" },
  { label: "Save", value: "save" },
  { label: "Format", value: "format" },
  { label: "Generate", value: "generate" },
  { label: "Refactor", value: "refactor" },
];

interface CommandPaletteProps {
  onAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onAction }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(ACTIONS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setFiltered(ACTIONS);
    }
  }, [open]);

  useEffect(() => {
    if (!query) setFiltered(ACTIONS);
    else {
      const q = query.toLowerCase();
      setFiltered(
        ACTIONS.filter(a => a.label.toLowerCase().includes(q) || fuzzy(a.label, q))
      );
    }
  }, [query]);

  function fuzzy(str: string, pattern: string) {
    // Simple fuzzy match: all pattern chars in order
    let i = 0;
    for (let c of str.toLowerCase()) if (c === pattern[i]) i++;
    return i === pattern.length;
  }

  const handleSelect = (action: string) => {
    onAction(action);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15 }}
          className="fixed top-0 left-0 w-full h-full z-50 flex items-start justify-center bg-black/40"
        >
          <div className="mt-32 w-full max-w-md bg-[#18192a] border border-[#232347] rounded-lg shadow-lg p-4">
            <input
              ref={inputRef}
              className="w-full px-3 py-2 rounded bg-[#232347] text-white outline-none mb-2 font-mono"
              placeholder="Type a command..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && filtered.length > 0) handleSelect(filtered[0].value);
                if (e.key === "Escape") setOpen(false);
              }}
            />
            <div className="space-y-1">
              {filtered.length === 0 && <div className="text-[#a259ff] text-sm">No matches</div>}
              {filtered.map(a => (
                <div
                  key={a.value}
                  className="px-3 py-2 rounded cursor-pointer hover:bg-[#00fff7] hover:text-[#18192a] text-white font-mono"
                  onClick={() => handleSelect(a.value)}
                >
                  {a.label}
                </div>
              ))}
            </div>
            <div className="text-xs text-[#444] mt-2">Shortcut: Ctrl+K / Cmd+K</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
