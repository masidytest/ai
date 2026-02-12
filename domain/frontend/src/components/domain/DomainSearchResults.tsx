"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DomainResult {
  name: string;
  available: boolean;
}

interface DomainSearchResultsProps {
  result: DomainResult;
  alternatives: DomainResult[];
  onRegister?: (name: string) => void;
}

const MOCK_PRICES: Record<string, number> = {
  ".com": 12,
  ".net": 10,
  ".io": 35,
  ".dev": 18,
};
function getPrice(name: string) {
  const tld = name.slice(name.lastIndexOf("."));
  return MOCK_PRICES[tld] || 15;
}

export const DomainSearchResults: React.FC<DomainSearchResultsProps> = ({ result, alternatives, onRegister }) => {
  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 mt-4">
      <div className="mb-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4">
          <span className="text-lg font-bold text-[#a259ff]">{result.name}</span>
          <span className={`px-2 py-1 rounded text-xs font-bold ${result.available ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>
            {result.available ? "Available" : "Taken"}
          </span>
          <span className="text-[#00fff7] font-mono">${getPrice(result.name)} /yr</span>
          {result.available && (
            <Button className="ml-4 bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => onRegister?.(result.name)}>
              Register
            </Button>
          )}
        </motion.div>
      </div>
      <div>
        <div className="text-[#a259ff] font-semibold mb-2">Suggested Alternatives</div>
        <div className="flex flex-wrap gap-3">
          {alternatives.map((alt, i) => (
            <motion.div key={alt.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }} className="flex items-center gap-2 bg-[#232347] rounded px-3 py-2">
              <span className="font-mono">{alt.name}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${alt.available ? "bg-green-500 text-black" : "bg-red-500 text-white"}`}>
                {alt.available ? "Available" : "Taken"}
              </span>
              <span className="text-[#00fff7] font-mono">${getPrice(alt.name)}</span>
              {alt.available && (
                <Button size="sm" className="ml-2 bg-[#00fff7] text-[#18192a] hover:bg-[#a259ff] hover:text-white" onClick={() => onRegister?.(alt.name)}>
                  Register
                </Button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};
