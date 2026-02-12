import React, { useState, useRef } from "react";
import { useUIBuilder } from "./UIBuilderContext";

async function callAiApi(endpoint: string, body: any) {
  // Replace with real API call to backend
  const res = await fetch(`/api/ai-ui/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

interface AiUiAssistantPanelProps {
  onPreview?: (tree: any) => void;
}

export const AiUiAssistantPanel: React.FC<AiUiAssistantPanelProps> = ({ onPreview }) => {
  const { app } = useUIBuilder();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const lastResult = useRef<any>(null);

  async function handleGenerate(type: "layout" | "components" | "full") {
    setLoading(true);
    setStream("");
    setMessages(msgs => [...msgs, { role: "user", text: input }]);
    let aiMsg = { role: "ai", text: "", data: null };
    setMessages(msgs => [...msgs, aiMsg]);
    let result;
    if (type === "layout") {
      result = await callAiApi("generate/layout", { prompt: input });
      aiMsg.text = JSON.stringify(result.layout, null, 2);
      aiMsg.data = result.layout;
    } else if (type === "components") {
      result = await callAiApi("generate/components", { prompt: input });
      aiMsg.text = JSON.stringify(result.tree, null, 2);
      aiMsg.data = result.tree;
    } else {
      result = await callAiApi("generate", { prompt: input });
      aiMsg.text = JSON.stringify(result, null, 2);
      aiMsg.data = result;
    }
    setMessages(msgs => msgs.slice(0, -1).concat(aiMsg));
    setStream("");
    setLoading(false);
    lastResult.current = aiMsg.data;
    setHistory(h => [aiMsg.data, ...h]);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    // Optionally: treat as full UI generation
    handleGenerate("full");
    setInput("");
  }

  function handlePreview() {
    if (!lastResult.current) return;
    // Prefer .tree, fallback to .layout
    const tree = lastResult.current.tree || lastResult.current.layout || lastResult.current;
    if (onPreview && tree) onPreview(tree);
  }

  return (
    <div className="bg-[#18192a] border-l border-[#232347] w-96 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "bg-[#a259ff] text-white" : "bg-[#232347] text-[#00fff7]"} style={{ borderRadius: 8, padding: 8, display: "inline-block", maxWidth: "80%" }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-[#a259ff]">Streaming...</div>}
        {stream && <div className="text-[#00fff7] whitespace-pre-wrap">{stream}</div>}
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t border-[#232347] bg-[#232347]">
        <input
          className="flex-1 px-2 py-1 rounded bg-[#18192a] text-white border border-[#a259ff] focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Describe your UI..."
          disabled={loading}
        />
        <button type="submit" className="ml-2 px-3 py-1 rounded bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a] transition" disabled={loading}>Send</button>
      </form>
      <div className="flex gap-2 p-2 border-t border-[#232347] bg-[#232347]">
        <button onClick={() => handleGenerate("layout")} className="flex-1 px-2 py-1 rounded bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a] transition" disabled={loading}>Generate Layout</button>
        <button onClick={() => handleGenerate("components")} className="flex-1 px-2 py-1 rounded bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a] transition" disabled={loading}>Generate Components</button>
        <button onClick={() => handleGenerate("full")} className="flex-1 px-2 py-1 rounded bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a] transition" disabled={loading}>Generate Full UI</button>
      </div>
      <div className="flex p-2 border-t border-[#232347] bg-[#232347]">
        <button onClick={handlePreview} className="flex-1 px-2 py-1 rounded bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white transition">Preview & Validate</button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 border-t border-[#232347] bg-[#18192a]">
        <div className="font-bold text-[#a259ff] mb-2">History</div>
        {history.map((h, i) => (
          <div key={i} className="mb-2 p-2 bg-[#232347] rounded text-xs text-[#00fff7] whitespace-pre-wrap max-h-32 overflow-y-auto">
            {JSON.stringify(h, null, 2)}
          </div>
        ))}
      </div>
    </div>
  );
};
