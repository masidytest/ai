"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* ─── Resizable handle + panel system ─── */

interface ResizeHandleProps {
  direction: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  className?: string;
}

export function ResizeHandle({ direction, onResize, className = "" }: ResizeHandleProps) {
  const dragging = useRef(false);
  const lastPos = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastPos.current = direction === "horizontal" ? e.clientX : e.clientY;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
    },
    [direction]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const pos = direction === "horizontal" ? e.clientX : e.clientY;
      const delta = pos - lastPos.current;
      lastPos.current = pos;
      onResize(delta);
    },
    [direction, onResize]
  );

  const onPointerUp = useCallback(() => {
    dragging.current = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const isH = direction === "horizontal";

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={`${isH ? "w-1 cursor-col-resize hover:w-1.5" : "h-1 cursor-row-resize hover:h-1.5"} 
        bg-app-border/40 hover:bg-app-accent/40 active:bg-app-accent/60 
        transition-all duration-150 shrink-0 relative group z-10 ${className}`}
    >
      {/* Visual indicator dots */}
      <div className={`absolute ${isH ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col" : "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-row"} flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity`}>
        <span className="w-1 h-1 rounded-full bg-app-accent/60" />
        <span className="w-1 h-1 rounded-full bg-app-accent/60" />
        <span className="w-1 h-1 rounded-full bg-app-accent/60" />
      </div>
    </div>
  );
}

/* ─── Hook for panel width/height with min/max/persist ─── */

interface UseResizableOptions {
  initial: number;
  min: number;
  max: number;
  storageKey?: string;
}

export function useResizable({ initial, min, max, storageKey }: UseResizableOptions) {
  const [size, setSize] = useState(() => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const n = parseInt(saved, 10);
        if (!isNaN(n) && n >= min && n <= max) return n;
      }
    }
    return initial;
  });

  const handleResize = useCallback(
    (delta: number) => {
      setSize((prev) => {
        const next = Math.max(min, Math.min(max, prev + delta));
        return next;
      });
    },
    [min, max]
  );

  // Persist
  useEffect(() => {
    if (storageKey) localStorage.setItem(storageKey, String(size));
  }, [size, storageKey]);

  return { size, setSize, handleResize };
}
