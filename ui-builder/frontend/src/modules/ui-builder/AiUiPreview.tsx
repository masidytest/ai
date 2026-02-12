import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

// Types for generated tree
interface GeneratedComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: GeneratedComponent[];
}

interface AiUiPreviewProps {
  tree: GeneratedComponent;
  onAccept: (tree: GeneratedComponent) => void;
  onReject: () => void;
}

// Helper: Render component tree as a nested list
function renderTree(node: GeneratedComponent) {
  return (
    <li key={node.id}>
      <span className="text-[#a259ff] font-mono">{node.type}</span>
      {node.children && node.children.length > 0 && (
        <ul className="ml-4 border-l border-[#232347] pl-2">
          {node.children.map(renderTree)}
        </ul>
      )}
    </li>
  );
}

// Helper: Render a simple layout preview (boxes)
function renderLayout(node: GeneratedComponent) {
  const { x = 0, y = 0, w = 120, h = 48 } = node.props || {};
  return (
    <motion.div
      key={node.id}
      className="absolute border border-[#a259ff] bg-[#232347] rounded flex items-center justify-center text-xs text-[#a259ff] shadow-md"
      style={{ left: x, top: y, width: w, height: h }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.18 }}
    >
      {node.type}
      {node.children && node.children.map(renderLayout)}
    </motion.div>
  );
}

export const AiUiPreview: React.FC<AiUiPreviewProps> = ({ tree, onAccept, onReject }) => {
  const [showTree, setShowTree] = useState(true);
  return (
    <Card className="bg-[#18192a] border border-[#232347] p-4 w-full max-w-2xl mx-auto relative">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[#a259ff] font-bold text-lg">AI UI Preview</span>
        <div className="flex gap-2">
          <Button variant={showTree ? "default" : "outline"} onClick={() => setShowTree(true)} size="sm">Component Tree</Button>
          <Button variant={!showTree ? "default" : "outline"} onClick={() => setShowTree(false)} size="sm">Layout Preview</Button>
        </div>
      </div>
      <div className="bg-[#232347] rounded p-3 min-h-[180px] relative overflow-auto" style={{ height: 260 }}>
        {showTree ? (
          <ul className="text-xs leading-6">{renderTree(tree)}</ul>
        ) : (
          <div className="relative w-full h-full min-h-[180px]" style={{ minHeight: 180 }}>
            {renderLayout(tree)}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={onReject} className="border-[#a259ff] text-[#a259ff]">Reject</Button>
        <Button onClick={() => onAccept(tree)} className="bg-[#a259ff] text-white hover:bg-[#7c3aed]">Accept & Insert</Button>
      </div>
    </Card>
  );
};
