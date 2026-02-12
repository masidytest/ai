"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AiWorkflowPreviewProps {
  workflow: {
    nodes: any[];
    connections: any[];
    triggers?: any[];
  };
  onAccept: () => void;
  onReject: () => void;
}

export const AiWorkflowPreview: React.FC<AiWorkflowPreviewProps> = ({ workflow, onAccept, onReject }) => {
  return (
    <Card className="bg-[#18192a] border border-[#232347] p-6 w-full max-w-2xl mx-auto flex flex-col items-center">
      <div className="font-semibold text-[#a259ff] mb-4 text-xl">AI Workflow Preview</div>
      {/* Trigger Preview */}
      {workflow.triggers && workflow.triggers.length > 0 && (
        <div className="mb-4 w-full">
          <div className="text-[#00fff7] font-bold mb-1">Trigger</div>
          <div className="bg-[#232347] rounded p-2 text-[#a259ff] font-mono">
            {JSON.stringify(workflow.triggers[0], null, 2)}
          </div>
        </div>
      )}
      {/* Nodes and Connections Preview */}
      <div className="relative w-full h-64 bg-[#10111a] rounded mb-4 overflow-auto border border-[#232347]">
        {/* Render connections as SVG lines */}
        <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
          {workflow.connections.map((c, i) => {
            const from = workflow.nodes.find((n) => n.id === c.from || n.id === c.fromNode);
            const to = workflow.nodes.find((n) => n.id === c.to || n.id === c.toNode);
            if (!from || !to) return null;
            // Use placeholder positions if not present
            const fx = from.position?.x ?? 100 + i * 60;
            const fy = from.position?.y ?? 60;
            const tx = to.position?.x ?? 200 + i * 60;
            const ty = to.position?.y ?? 180;
            return (
              <line
                key={i}
                x1={fx}
                y1={fy}
                x2={tx}
                y2={ty}
                stroke="#00fff7"
                strokeWidth={3}
                opacity={0.7}
              />
            );
          })}
        </svg>
        {/* Render nodes */}
        {workflow.nodes.map((node, i) => (
          <div
            key={node.id}
            className="absolute flex flex-col items-center justify-center px-4 py-2 rounded-lg border-2 font-semibold text-sm cursor-pointer select-none"
            style={{
              left: (node.position?.x ?? 100 + i * 60),
              top: (node.position?.y ?? 60),
              borderColor: node.type === "trigger" ? "#a259ff" : node.type === "action" ? "#00fff7" : "#00dbff",
              color: node.type === "trigger" ? "#a259ff" : node.type === "action" ? "#00fff7" : "#00dbff",
              background: "#18192a",
              minWidth: 80,
              zIndex: 2,
            }}
          >
            <div className="font-bold">{node.name || node.label || node.type}</div>
            <div className="text-xs text-[#a259ff] font-mono">{node.id}</div>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-2">
        <Button className="bg-green-500 text-white hover:bg-green-700" onClick={onAccept}>Accept</Button>
        <Button className="bg-red-500 text-white hover:bg-red-700" onClick={onReject}>Reject</Button>
      </div>
    </Card>
  );
};
