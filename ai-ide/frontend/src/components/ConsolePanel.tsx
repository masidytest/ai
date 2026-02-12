"use client";
import React, { useEffect, useRef } from "react";

export interface ConsolePanelProps {
  stdout: string;
  stderr?: string;
  onClear: () => void;
}

export const ConsolePanel: React.FC<ConsolePanelProps> = ({ stdout, stderr, onClear }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [stdout, stderr]);

  return (
    <div className="bg-[#18192a] border-t border-[#232347] h-48 flex flex-col font-mono text-sm">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#232347] bg-[#232347]">
        <span className="text-[#00fff7] font-bold">Console</span>
        <button
          className="px-2 py-1 rounded bg-[#232347] text-[#a259ff] hover:bg-[#00fff7] hover:text-[#18192a] transition text-xs"
          onClick={onClear}
        >
          Clear
        </button>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 text-[#e0e0e0] bg-[#18192a]"
        style={{ fontFamily: 'JetBrains Mono, Fira Mono, monospace' }}
      >
        {stdout && <pre className="whitespace-pre-wrap text-[#00fff7]">{stdout}</pre>}
        {stderr && <pre className="whitespace-pre-wrap text-[#ff4b82]">{stderr}</pre>}
        {!stdout && !stderr && <span className="text-[#444]">No output yet.</span>}
      </div>
    </div>
  );
};
