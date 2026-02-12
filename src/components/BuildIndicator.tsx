"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { buildManager } from "@/lib/buildManager";

/**
 * Floating build indicator — shows on every dashboard page when a build is active.
 * Clicking it navigates back to the IDE.
 */
export function BuildIndicator() {
  const router = useRouter();
  const [phase, setPhase] = useState(buildManager.phase);
  const [progress, setProgress] = useState(buildManager.progress);

  useEffect(() => {
    const unsubscribe = buildManager.subscribe(() => {
      setPhase(buildManager.phase);
      setProgress(buildManager.progress);
    });
    return unsubscribe;
  }, []);

  // Only show when a build or chat is actively running
  if (phase !== "building" && phase !== "chatting") return null;

  return (
    <button
      onClick={() => router.push("/dashboard/ai-ide")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#1a1a2e]/95 backdrop-blur-md border border-violet-500/30 rounded-2xl shadow-2xl shadow-violet-500/10 hover:border-violet-500/60 transition-all group cursor-pointer"
    >
      {/* Spinning indicator */}
      <div className="relative w-8 h-8 shrink-0">
        <svg className="w-8 h-8 animate-spin" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="#2d2d4a" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15" fill="none" stroke="url(#buildGrad)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${Math.max(progress, 15)} 100`}
            style={{ transformOrigin: "center", transform: "rotate(-90deg)" }}
          />
          <defs>
            <linearGradient id="buildGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-violet-400">
          {phase === "building" ? `${Math.round(progress)}%` : "AI"}
        </span>
      </div>

      <div className="text-left">
        <p className="text-xs font-semibold text-white/90">
          {phase === "building" ? "Building project..." : "AI thinking..."}
        </p>
        <p className="text-[10px] text-white/40 group-hover:text-violet-400 transition-colors">
          Click to view in IDE
        </p>
      </div>

      {/* Pulse ring */}
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500 animate-ping opacity-50" />
      <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-violet-500" />
    </button>
  );
}
