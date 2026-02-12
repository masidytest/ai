"use client";
import React from "react";
import { Card } from "@/components/ui/card";

export interface WhoisData {
  registrar: string;
  createdAt: string;
  expiresAt: string;
  nameservers: string[];
  // owner info is redacted
}

interface WhoisViewerProps {
  whois: WhoisData;
}

export const WhoisViewer: React.FC<WhoisViewerProps> = ({ whois }) => {
  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4">
      <div className="font-semibold text-[#a259ff] mb-2">WHOIS Information</div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div><span className="text-[#00fff7]">Registrar:</span> {whois.registrar}</div>
        <div><span className="text-[#00fff7]">Created:</span> {whois.createdAt}</div>
        <div><span className="text-[#00fff7]">Expires:</span> {whois.expiresAt}</div>
        <div className="col-span-2">
          <span className="text-[#00fff7]">Nameservers:</span>
          <ul className="ml-4 mt-1">
            {whois.nameservers.map((ns, i) => (
              <li key={i} className="font-mono text-[#a259ff]">{ns}</li>
            ))}
          </ul>
        </div>
        <div className="col-span-2">
          <span className="text-[#00fff7]">Owner:</span> <span className="text-gray-400 italic">[REDACTED]</span>
        </div>
      </div>
    </Card>
  );
};
