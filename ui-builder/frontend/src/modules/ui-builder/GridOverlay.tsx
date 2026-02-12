import React from "react";

export const GridOverlay: React.FC<{ gridSize?: number }> = ({ gridSize = 16 }) => {
  const lines = [];
  for (let i = 1; i < 100; i++) {
    lines.push(
      <div
        key={"v-" + i}
        className="absolute top-0 bottom-0 border-l border-[#232347] opacity-20"
        style={{ left: i * gridSize }}
      />
    );
    lines.push(
      <div
        key={"h-" + i}
        className="absolute left-0 right-0 border-t border-[#232347] opacity-20"
        style={{ top: i * gridSize }}
      />
    );
  }
  return <>{lines}</>;
};
