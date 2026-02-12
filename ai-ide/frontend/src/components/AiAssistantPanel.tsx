"use client";
import React, { useRef, useState } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
  type?: "generate" | "refactor" | "explain";
}

interface AiAssistantPanelProps {
  onInsertCode?: (code: string) => void;
  onRun?: (code: string) => void;
}

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({ onInsertCode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState<null | "generate" | "refactor" | "explain">(null);
  const [stream, setStream] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const sendPrompt = async (type: "generate" | "refactor" | "explain") => {
    if (!input.trim()) return;
    setLoading(type);
    setStream("");
    setMessages(msgs => [...msgs, { role: "user", content: input, type }]);
    // Simulate streaming response
    let fake = "";
    const fakeResponse =
      type === "generate"
        ? `function hello() {\n  console.log('Hello, world!');\n}`
        : type === "refactor"
        ? `// Refactored code\nfunction greet() {\n  alert('Hello!');\n}`
        : `// This function prints Hello, world! to the console.`;
    let i = 0;
    const interval = setInterval(() => {
      fake += fakeResponse[i] || "";
      setStream(fake);
      i++;
      if (i >= fakeResponse.length) {
        clearInterval(interval);
        setMessages(msgs => [...msgs, { role: "ai", content: fake, type }]);
        setLoading(null);
        setInput("");
      }
    }, 18);
  };

  const handleInsert = (code: string) => {
    if (onInsertCode) onInsertCode(code);
  };

  return (
    <div className="flex flex-col h-full bg-[#18192a] border-l border-[#232347]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div className={msg.role === "user" ? "inline-block bg-[#232347] text-[#00fff7] px-3 py-2 rounded-lg" : "inline-block bg-[#232347] text-[#a259ff] px-3 py-2 rounded-lg"}>
              {msg.content}
            </div>
            {msg.role === "ai" && (
              <button
                className="ml-2 px-2 py-1 text-xs bg-[#00fff7] text-[#18192a] rounded hover:bg-[#a259ff] hover:text-white transition"
                onClick={() => handleInsert(msg.content)}
                title="Insert code into editor"
              >
                Insert
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block bg-[#232347] text-[#a259ff] px-3 py-2 rounded-lg animate-pulse">
              {stream || <span className="opacity-50">AI is thinking...</span>}
            </div>
            {stream && (
              <button
                className="ml-2 px-2 py-1 text-xs bg-[#00fff7] text-[#18192a] rounded hover:bg-[#a259ff] hover:text-white transition"
                onClick={() => handleInsert(stream)}
                title="Insert code into editor"
              >
                Insert
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-3 border-t border-[#232347] flex gap-2 bg-[#18192a]">
        <input
          ref={inputRef}
          className="flex-1 bg-[#232347] text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#00fff7] font-mono"
          placeholder="Ask AI to generate, refactor, or explain code..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !loading) sendPrompt("generate");
          }}
        />
        <button
          className="px-3 py-2 rounded bg-[#00fff7] text-[#18192a] font-bold hover:bg-[#a259ff] hover:text-white transition"
          disabled={loading !== null}
          onClick={() => sendPrompt("generate")}
        >
          Generate
        </button>
        <button
          className="px-3 py-2 rounded bg-[#232347] text-[#00fff7] font-bold hover:bg-[#a259ff] hover:text-white transition"
          disabled={loading !== null}
          onClick={() => sendPrompt("refactor")}
        >
          Refactor
        </button>
        <button
          className="px-3 py-2 rounded bg-[#232347] text-[#a259ff] font-bold hover:bg-[#00fff7] hover:text-white transition"
          disabled={loading !== null}
          onClick={() => sendPrompt("explain")}
        >
          Explain
        </button>
      </div>
    </div>
  );
};
