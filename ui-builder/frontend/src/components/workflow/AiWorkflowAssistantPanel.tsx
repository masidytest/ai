"use client";
import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WorkflowHistoryItem {
  prompt: string;
  type: "workflow" | "nodes" | "trigger";
  result: any;
  timestamp: number;
}

export const AiWorkflowAssistantPanel: React.FC<{
  onInsert?: (workflow: any) => void;
}> = ({ onInsert }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [stream, setStream] = useState("");
  const [history, setHistory] = useState<WorkflowHistoryItem[]>([]);
  const lastResult = useRef<any>(null);

  async function handleGenerate(type: "workflow" | "nodes" | "trigger") {
    setLoading(true);
    setStream("");
    setMessages(msgs => [...msgs, { role: "user", text: prompt }]);
    let url = "/api/ai-workflow/generate";
    if (type === "nodes") url = "/api/ai-workflow/generate/nodes";
    if (type === "trigger") url = "/api/ai-workflow/generate/trigger";
    // Simulate streaming response
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    let text = JSON.stringify(data, null, 2);
    // Simulate streaming by revealing text gradually
    let i = 0;
    setStream("");
    const interval = setInterval(() => {
      setStream(t => t + text[i]);
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setMessages(msgs => [...msgs, { role: "ai", text }]);
        setHistory(h => [
          { prompt, type, result: data, timestamp: Date.now() },
          ...h,
        ]);
        lastResult.current = data;
        setLoading(false);
      }
    }, 6);
  }

  function handleInsert() {
    if (onInsert && lastResult.current) {
      onInsert(lastResult.current);
    }
  }

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 flex flex-col h-full w-full max-w-xl mx-auto">
      <div className="font-semibold text-[#a259ff] mb-2">AI Workflow Assistant</div>
      <div className="flex-1 overflow-y-auto bg-[#232347] rounded p-2 mb-2 h-48">
        {messages.length === 0 && !stream ? (
          <div className="text-[#a259ff] text-sm">Ask me to generate a workflow, nodes, or trigger!</div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`mb-2 text-sm ${msg.role === "ai" ? "text-[#00fff7]" : "text-white"}`}>
                <span className="font-bold mr-1">{msg.role === "ai" ? "AI:" : "You:"}</span>
                <span>{msg.text}</span>
              </div>
            ))}
            {loading && (
              <div className="mb-2 text-[#00fff7] font-mono whitespace-pre-wrap animate-pulse">{stream}</div>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2 mb-2">
        <Input
          className="bg-[#232347] border-[#a259ff] text-[#00fff7]"
          placeholder="Describe your workflow..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && prompt && !loading) handleGenerate("workflow"); }}
          disabled={loading}
        />
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          onClick={() => handleGenerate("workflow")}
          disabled={loading || !prompt}
        >
          Generate Workflow
        </Button>
      </div>
      <div className="flex gap-2 mb-2">
        <Button
          className="bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a]"
          onClick={() => handleGenerate("nodes")}
          disabled={loading || !prompt}
        >
          Generate Nodes
        </Button>
        <Button
          className="bg-[#a259ff] text-white hover:bg-[#00fff7] hover:text-[#18192a]"
          onClick={() => handleGenerate("trigger")}
          disabled={loading || !prompt}
        >
          Generate Trigger
        </Button>
        <Button
          className="bg-green-500 text-white hover:bg-green-700"
          onClick={handleInsert}
          disabled={!lastResult.current}
        >
          Insert into Workflow
        </Button>
      </div>
      <div className="mt-4">
        <div className="text-[#a259ff] font-semibold mb-1">History</div>
        <div className="max-h-32 overflow-y-auto text-xs">
          {history.length === 0 ? (
            <div className="text-gray-500">No history yet.</div>
          ) : (
            history.map((item, i) => (
              <div key={i} className="mb-2 p-2 bg-[#232347] rounded">
                <div className="text-[#00fff7]">[{new Date(item.timestamp).toLocaleTimeString()}] {item.type}</div>
                <div className="text-white">{item.prompt}</div>
                <pre className="text-[#a259ff] whitespace-pre-wrap">{JSON.stringify(item.result, null, 2)}</pre>
              </div>
            ))
          )}
        </div>
      </div>
    </Card>
  );
};
