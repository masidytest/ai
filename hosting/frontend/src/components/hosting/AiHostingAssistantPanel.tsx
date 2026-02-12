"use client";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AiHostingAssistantPanelProps {
  onPlanSuggestion?: (plan: string) => void;
  onDeployConfig?: (config: any) => void;
}

interface Message {
  role: "user" | "ai";
  text: string;
}

export const AiHostingAssistantPanel: React.FC<AiHostingAssistantPanelProps> = ({ onPlanSuggestion, onDeployConfig }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function sendMessage(text: string) {
    setMessages(msgs => [...msgs, { role: "user", text }]);
    setLoading(true);
    // Call backend AI assistant API (stubbed)
    const res = await fetch("/hosting/api/ai/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { role: "ai", text: data.reply }]);
    setLoading(false);
  }

  async function handleSuggestPlan() {
    setLoading(true);
    const prompt = input || "Suggest a hosting plan for my project.";
    const res = await fetch("/hosting/api/ai/suggest-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { role: "ai", text: `Plan suggestion: ${data.plan}` }]);
    setLoading(false);
    if (onPlanSuggestion) onPlanSuggestion(data.plan);
  }

  async function handleGenerateDeployConfig() {
    setLoading(true);
    const prompt = input || "Generate a deploy config for my app.";
    const res = await fetch("/hosting/api/ai/generate-deploy-config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { role: "ai", text: `Deploy config: ${JSON.stringify(data.config, null, 2)}` }]);
    setLoading(false);
    if (onDeployConfig) onDeployConfig(data.config);
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col h-full">
      <div className="font-semibold text-[#a259ff] mb-2">AI Hosting Assistant</div>
      <div className="flex-1 overflow-y-auto bg-[#232347] rounded p-2 mb-2 h-48">
        {messages.length === 0 ? (
          <div className="text-[#a259ff] text-sm">Ask me about hosting, plans, or deployment!</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-2 text-sm ${msg.role === "ai" ? "text-[#00fff7]" : "text-white"}`}>
              <span className="font-bold mr-1">{msg.role === "ai" ? "AI:" : "You:"}</span>
              <span>{msg.text}</span>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          ref={inputRef}
          className="bg-[#232347] border-[#a259ff] text-[#00fff7]"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && input) { sendMessage(input); setInput(""); } }}
          disabled={loading}
        />
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          onClick={() => { if (input) { sendMessage(input); setInput(""); } }}
          disabled={loading || !input}
        >
          Send
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          className="bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a]"
          onClick={handleSuggestPlan}
          disabled={loading}
        >
          Suggest Plan
        </Button>
        <Button
          className="bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a]"
          onClick={handleGenerateDeployConfig}
          disabled={loading}
        >
          Generate Deploy Config
        </Button>
      </div>
    </Card>
  );
};
