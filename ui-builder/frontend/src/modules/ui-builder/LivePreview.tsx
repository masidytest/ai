import React from "react";
import { useUIBuilder } from "./UIBuilderContext";

const typeToElement: Record<string, React.ElementType> = {
  button: "button",
  text: "span",
  input: "input",
  // Add more mappings as needed
};

export const LivePreview: React.FC = () => {
  const { app } = useUIBuilder();
  if (!app) return null;
  return (
    <div className="w-full h-full bg-[#18192a] rounded-lg p-4 flex flex-wrap gap-2">
      {app.components.map(comp => {
        const Element = typeToElement[comp.type] || "div";
        return (
          <Element key={comp.id} style={{ width: comp.props.w, height: comp.props.h }} className="bg-[#232347] text-white rounded flex items-center justify-center">
            {comp.type === "button" ? "Button" : comp.type === "text" ? "Text" : comp.type}
          </Element>
        );
      })}
    </div>
  );
};
