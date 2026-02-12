"use client";
import React, { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

interface AiDomainAssistantPanelProps {
  onInsertName?: (name: string) => void;
  onInsertTld?: (tld: string) => void;
  onInsertDnsConfig?: (records: Array<{ type: string; name: string; value: string; ttl: number }>) => void;
}

export const AiDomainAssistantPanel: React.FC<AiDomainAssistantPanelProps> = ({
  onInsertName,
  onInsertTld,
  onInsertDnsConfig,
}) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string }>>([]);
  const [loading, setLoading] = useState(false);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  // Simulate AI backend (replace with real API)
  async function callAi(action: "names" | "tlds" | "dns") {
    setLoading(true);
    let aiMsg = "";
    if (action === "names") {
      aiMsg = `Here are some name ideas: masidy, masidyapp, getmasidy, masidypro`;
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { role: "user", text: prompt },
          { role: "ai", text: aiMsg },
        ]);
        setLoading(false);
        // Insert first suggestion
        if (onInsertName) onInsertName("masidy");
      }, 900);
    } else if (action === "tlds") {
      aiMsg = `Recommended TLDs: .com, .io, .dev, .ai`;
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { role: "user", text: prompt },
          { role: "ai", text: aiMsg },
        ]);
        setLoading(false);
        if (onInsertTld) onInsertTld(".com");
      }, 900);
    } else if (action === "dns") {
      aiMsg = `Generated DNS config:\nA @ 192.0.2.1\nCNAME www @`;
      setTimeout(() => {
        setMessages((msgs) => [
          ...msgs,
          { role: "user", text: prompt },
          { role: "ai", text: aiMsg },
        ]);
        setLoading(false);
        if (onInsertDnsConfig)
          onInsertDnsConfig([
            { type: "A", name: "@", value: "192.0.2.1", ttl: 3600 },
            { type: "CNAME", name: "www", value: "@", ttl: 3600 },
          ]);
      }, 900);
    }
    setPrompt("");
  }

  // Scroll to last message
  React.useEffect(() => {
    if (lastMsgRef.current) lastMsgRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 max-w-md mx-auto">
      <div className="font-semibold text-[#a259ff] mb-2">AI Domain Assistant</div>
      <div className="h-48 overflow-y-auto bg-[#232347] rounded p-2 mb-2 flex flex-col gap-2">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            ref={i === messages.length - 1 ? lastMsgRef : undefined}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-3 py-2 rounded max-w-[90%] ${msg.role === "user" ? "bg-[#a259ff] text-white self-end" : "bg-[#00fff7] text-[#18192a] self-start"}`}
          >
            {msg.text}
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-3 py-2 rounded bg-[#00fff7] text-[#18192a] self-start">
            Thinking...
          </motion.div>
        )}
      </div>
      <Textarea
        className="bg-[#232347] text-[#a259ff] border-[#232347] mb-2"
        placeholder="Ask for domain ideas, TLDs, or DNS config..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        disabled={loading}
      />
      <div className="flex gap-2">
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          disabled={!prompt.trim() || loading}
          onClick={() => callAi("names")}
        >
          Suggest Names
        </Button>
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          disabled={!prompt.trim() || loading}
          onClick={() => callAi("tlds")}
        >
          Suggest TLDs
        </Button>
        <Button
          className="bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white"
          disabled={!prompt.trim() || loading}
          onClick={() => callAi("dns")}
        >
          Generate DNS Config
        </Button>
      </div>
    </Card>
  );
};
