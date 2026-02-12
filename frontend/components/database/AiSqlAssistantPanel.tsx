"use client";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Info, Wand2 } from "lucide-react";

interface AiSqlAssistantPanelProps {
  onInsertSql: (sql: string) => void;
}

export function AiSqlAssistantPanel({ onInsertSql }: AiSqlAssistantPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "generate" | "explain" | "optimize") => {
    if (!input.trim()) return;
    setLoading(true);
    let endpoint = "";
    let userMsg = "";
    if (action === "generate") {
      endpoint = "/api/ai-sql/generate";
      userMsg = `Generate SQL for: ${input}`;
    } else if (action === "explain") {
      endpoint = "/api/ai-sql/explain";
      userMsg = `Explain SQL: ${input}`;
    } else if (action === "optimize") {
      endpoint = "/api/ai-sql/optimize";
      userMsg = `Optimize SQL: ${input}`;
    }
    setMessages((msgs) => [...msgs, { role: "user", content: userMsg }]);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "generate" ? { prompt: input } : { sql: input }),
      });
      const data = await res.json();
      let aiMsg = "";
      if (action === "generate" && data.sql) {
        aiMsg = data.sql;
        onInsertSql(data.sql);
      } else if (action === "explain" && data.explanation) {
        aiMsg = data.explanation;
      } else if (action === "optimize" && data.optimized) {
        aiMsg = data.optimized;
        onInsertSql(data.optimized);
      } else {
        aiMsg = "No response.";
      }
      setMessages((msgs) => [...msgs, { role: "ai", content: aiMsg }]);
    } catch {
      setMessages((msgs) => [...msgs, { role: "ai", content: "Error contacting AI service." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a] flex flex-col h-full">
      <h2 className="text-lg font-semibold text-purple-300 mb-2">AI SQL Assistant</h2>
      <div className="flex-1 overflow-y-auto mb-2 max-h-60">
        <ul className="space-y-2">
          {messages.map((msg, i) => (
            <li key={i} className={msg.role === "user" ? "text-blue-200" : "text-purple-200"}>
              <span className="block whitespace-pre-line bg-[#22134a] rounded px-3 py-2">
                {msg.content}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Describe your query or paste SQL..."
        className="mb-2 bg-[#22134a] border-[#2d1a5a] text-white"
        rows={2}
        disabled={loading}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg flex items-center gap-2"
          onClick={() => handleAction("generate")}
          disabled={loading || !input.trim()}
        >
          <Sparkles size={16} /> Generate Query
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center gap-2"
          onClick={() => handleAction("explain")}
          disabled={loading || !input.trim()}
        >
          <Info size={16} /> Explain Query
        </Button>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-700 to-blue-700 shadow-lg flex items-center gap-2"
          onClick={() => handleAction("optimize")}
          disabled={loading || !input.trim()}
        >
          <Wand2 size={16} /> Optimize Query
        </Button>
      </div>
    </Card>
  );
}
