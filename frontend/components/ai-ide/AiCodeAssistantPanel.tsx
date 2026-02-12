"use client";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, RefreshCw, Info, Wand2, Code2 } from "lucide-react";

interface AiCodeAssistantPanelProps {
  onInsertCode: (code: string) => void;
  onReplaceSelection: (code: string) => void;
  onCreateFile: (path: string, content: string) => void;
}

type Action = "generate" | "refactor" | "explain" | "fix" | "complete";

export function AiCodeAssistantPanel({ onInsertCode, onReplaceSelection, onCreateFile }: AiCodeAssistantPanelProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string; action: Action }[]>([]);
  const [loading, setLoading] = useState<Action | null>(null);
  const [history, setHistory] = useState<typeof messages[]>([]);
  const [stream, setStream] = useState("");

  const handleAction = async (action: Action) => {
    if (!input.trim()) return;
    setLoading(action);
    setMessages((msgs) => [...msgs, { role: "user", content: input, action }]);
    setStream("");
    let endpoint = "/ai-ide/code/generate";
    let body: any = { prompt: input };
    if (action === "refactor") {
      endpoint = "/ai-ide/code/refactor";
      body = { code: input, instructions: "Refactor as requested" };
    } else if (action === "explain") {
      endpoint = "/ai-ide/code/explain";
      body = { code: input };
    } else if (action === "fix") {
      endpoint = "/ai-ide/code/fix";
      body = { code: input };
    } else if (action === "complete") {
      endpoint = "/ai-ide/code/complete";
      body = { code: input, cursorPosition: input.length };
    }
    try {
      // Streaming stub: just fetch and simulate streaming
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      let aiMsg = "";
      if (data.code) aiMsg = data.code;
      else if (data.completion) aiMsg = data.completion;
      else if (data.explanation) aiMsg = data.explanation;
      else if (data.files) aiMsg = data.files.map((f: any) => `${f.path}:\n${f.content}`).join("\n\n");
      else aiMsg = JSON.stringify(data, null, 2);
      setMessages((msgs) => [...msgs, { role: "ai", content: aiMsg, action }]);
      setStream(aiMsg);
    } catch {
      setMessages((msgs) => [...msgs, { role: "ai", content: "Error contacting AI service.", action }]);
    } finally {
      setLoading(null);
      setHistory((h) => [...h, messages]);
    }
  };

  const handleInsert = () => {
    if (stream) onInsertCode(stream);
  };
  const handleReplace = () => {
    if (stream) onReplaceSelection(stream);
  };
  const handleCreateFile = () => {
    if (stream) onCreateFile("src/generated/AIFile.ts", stream);
  };

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a] flex flex-col h-full">
      <h2 className="text-lg font-semibold text-purple-300 mb-2">AI Code Assistant</h2>
      <div className="flex-1 overflow-y-auto mb-2 max-h-60">
        <ul className="space-y-2">
          {messages.map((msg, i) => (
            <li key={i} className={msg.role === "user" ? "text-blue-200" : "text-purple-200"}>
              <span className="block whitespace-pre-line bg-[#22134a] rounded px-3 py-2">
                {msg.content}
              </span>
            </li>
          ))}
          {loading && (
            <li className="text-purple-400 animate-pulse">
              <span className="block whitespace-pre-line bg-[#22134a] rounded px-3 py-2">AI is thinking...</span>
            </li>
          )}
        </ul>
      </div>
      <Textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Describe your code task or paste code..."
        className="mb-2 bg-[#22134a] border-[#2d1a5a] text-white"
        rows={2}
        disabled={!!loading}
      />
      <div className="flex gap-2 mb-2">
        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg flex items-center gap-2" onClick={() => handleAction("generate")}
          disabled={!!loading || !input.trim()}><Sparkles size={16} /> Generate</Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg flex items-center gap-2" onClick={() => handleAction("refactor")}
          disabled={!!loading || !input.trim()}><RefreshCw size={16} /> Refactor</Button>
        <Button size="sm" className="bg-gradient-to-r from-purple-700 to-blue-700 shadow-lg flex items-center gap-2" onClick={() => handleAction("explain")}
          disabled={!!loading || !input.trim()}><Info size={16} /> Explain</Button>
        <Button size="sm" className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-lg flex items-center gap-2" onClick={() => handleAction("fix")}
          disabled={!!loading || !input.trim()}><Wand2 size={16} /> Fix</Button>
        <Button size="sm" className="bg-gradient-to-r from-purple-800 to-blue-800 shadow-lg flex items-center gap-2" onClick={() => handleAction("complete")}
          disabled={!!loading || !input.trim()}><Code2 size={16} /> Complete</Button>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={handleInsert} disabled={!stream}>Insert</Button>
        <Button size="sm" variant="ghost" onClick={handleReplace} disabled={!stream}>Replace Selection</Button>
        <Button size="sm" variant="ghost" onClick={handleCreateFile} disabled={!stream}>Create File</Button>
      </div>
      <div className="mt-4">
        <h3 className="text-xs text-purple-400 mb-1">History</h3>
        <ul className="space-y-1 max-h-24 overflow-y-auto text-xs">
          {history.map((h, i) => (
            <li key={i} className="truncate text-purple-300">{h.map(m => m.action).join(", ")}</li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
