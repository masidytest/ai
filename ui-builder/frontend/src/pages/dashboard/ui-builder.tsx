import React from "react";
import dynamic from "next/dynamic";
import { UiBuilderLayout } from "../../modules/ui-builder/UiBuilderLayout";
import { AiUiAssistantPanel } from "../../modules/ui-builder/AiUiAssistantPanel";

// Lazy load heavy modules for performance
const ComponentPalette = dynamic(() => import("../../modules/ui-builder/ComponentPalette").then(m => m.ComponentPalette), { ssr: false });
const Canvas = dynamic(() => import("../../modules/ui-builder/Canvas").then(m => m.Canvas), { ssr: false });
const PropertiesPanel = dynamic(() => import("../../modules/ui-builder/PropertiesPanel").then(m => m.PropertiesPanel), { ssr: false });
const ComponentTree = dynamic(() => import("../../modules/ui-builder/ComponentTree").then(m => m.ComponentTree), { ssr: false });

export default function UiBuilderPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#18192a] via-[#232347] to-[#1a0036] flex flex-row overflow-hidden">
      <div className="flex-1 flex flex-col">
        <UiBuilderLayout />
      </div>
      <div className="w-96 border-l border-[#232347] bg-[#18192a] shadow-xl flex flex-col">
        <AiUiAssistantPanel />
      </div>
    </div>
  );
}
