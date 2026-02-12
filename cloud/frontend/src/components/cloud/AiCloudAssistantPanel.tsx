"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AiCloudAssistantPanelProps {
  onSuggestion?: (suggestion: any) => void;
}

export const AiCloudAssistantPanel: React.FC<AiCloudAssistantPanelProps> = ({ onSuggestion }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const lastSuggestion = useRef<any>(null);

  async function callAi(endpoint: string, body: any) {
    setLoading(true);
    setMessages(msgs => [...msgs, { role: "user", text: input }]);
    let aiMsg = { role: "ai", text: "", data: null };
    setMessages(msgs => [...msgs, aiMsg]);
    const res = await fetch(`/api/cloud/ai/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    aiMsg.text = typeof data === "string" ? data : JSON.stringify(data, null, 2);
    aiMsg.data = data;
    setMessages(msgs => msgs.slice(0, -1).concat(aiMsg));
    setLoading(false);
    lastSuggestion.current = data;
    if (onSuggestion) onSuggestion(data);
  }

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    callAi("explain", { prompt: input });
    setInput("");
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] w-full max-w-md mx-auto p-4 flex flex-col">
      <div className="flex-1 overflow-y-auto mb-2 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right" : "text-left"}>
            <span className={msg.role === "user" ? "bg-[#a259ff] text-white" : "bg-[#232347] text-[#00fff7]"} style={{ borderRadius: 8, padding: 8, display: "inline-block", maxWidth: "80%" }}>{msg.text}</span>
          </div>
        ))}
        {loading && <div className="text-[#a259ff]">Thinking...</div>}
      </div>
      <form onSubmit={handleSend} className="flex gap-2 mb-2">
        <input
          className="flex-1 px-2 py-1 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about cloud servers..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input} className="bg-[#a259ff] text-white">Send</Button>
      </form>
      <div className="flex gap-2 mb-2">
        <Button onClick={() => callAi("suggest-plan", { prompt: input })} disabled={loading} className="bg-[#00fff7] text-[#18192a]">Suggest Plan</Button>
        <Button onClick={() => callAi("suggest-region", { prompt: input })} disabled={loading} className="bg-[#00fff7] text-[#18192a]">Suggest Region</Button>
        <Button onClick={() => callAi("generate-config", { prompt: input })} disabled={loading} className="bg-[#00fff7] text-[#18192a]">Generate Config</Button>
      </div>
      <div className="text-xs text-[#a259ff]">Click a button to insert suggestion into Create Server form.</div>
    </Card>
  );
};
