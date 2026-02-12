import React, { useState } from "react";
import { UIBuilderProvider } from "./UIBuilderContext";
import { DragDropProvider } from "./DragDropContext";
import { ComponentPalette } from "./ComponentPalette";
import { ComponentTree } from "./ComponentTree";
import { Canvas } from "./Canvas";
import { PropertiesPanel } from "./PropertiesPanel";
import { LivePreview } from "./LivePreview";
import { motion, AnimatePresence } from "framer-motion";
import { AiUiAssistantPanel } from "./AiUiAssistantPanel";
import { AiUiPreview } from "./AiUiPreview";

export const UIBuilderLayout: React.FC = () => {
  const [preview, setPreview] = useState(false);
  const [leftWidth, setLeftWidth] = useState(220);
  const [rightWidth, setRightWidth] = useState(320);
  const [bottomHeight, setBottomHeight] = useState(180);
  const [dragging, setDragging] = useState<string|null>(null);
  const layoutRef = React.useRef<HTMLDivElement>(null);
  // AI UI preview state
  const [aiPreview, setAiPreview] = useState<any|null>(null);
  const [aiValidation, setAiValidation] = useState<{errors:string[],warnings:string[]} | null>(null);
  // For passing insert event to Canvas
  function handleInsertTree(tree: any) {
    window.dispatchEvent(new CustomEvent('insert-ai-tree', { detail: { tree } }));
    setAiPreview(null);
    setAiValidation(null);
  }

  function onDragStart(panel: string, e: React.MouseEvent) {
    setDragging(panel);
    document.body.style.cursor = panel === "left" || panel === "right" ? "ew-resize" : "ns-resize";
  }
  function onDrag(e: React.MouseEvent) {
    if (!dragging || !layoutRef.current) return;
    const rect = layoutRef.current.getBoundingClientRect();
    if (dragging === "left") {
      setLeftWidth(Math.max(160, Math.min(e.clientX - rect.left, 400)));
    } else if (dragging === "right") {
      setRightWidth(Math.max(220, Math.min(rect.right - e.clientX, 500)));
    } else if (dragging === "bottom") {
      setBottomHeight(Math.max(120, Math.min(rect.bottom - e.clientY, 400)));
    }
  }
  function onDragEnd() {
    setDragging(null);
    document.body.style.cursor = "";
  }

  return (
    <UIBuilderProvider>
      <DragDropProvider>
        <div ref={layoutRef} className="w-full h-screen flex flex-col bg-[#10111a] text-white" onMouseMove={onDrag} onMouseUp={onDragEnd} onMouseLeave={onDragEnd}>
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#232347]">
            <span className="text-lg font-bold text-[#a259ff]">UI Builder</span>
            <button
              className="px-4 py-1 rounded bg-[#232347] text-[#00fff7] border border-[#a259ff] hover:bg-[#2d2e4a] transition"
              onClick={() => setPreview(p => !p)}
            >
              {preview ? "Edit Mode" : "Live Preview"}
            </button>
          </div>
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex items-center justify-center"
              >
                <LivePreview />
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex flex-1 min-h-0">
                  {/* Left: Palette */}
                  <div style={{ width: leftWidth, minWidth: 120 }} className="h-full flex-shrink-0 flex flex-col border-r border-[#232347] bg-[#18192a]">
                    <ComponentPalette />
                  </div>
                  {/* Left Resizer */}
                  <div
                    className="w-2 cursor-ew-resize bg-[#232347] hover:bg-[#a259ff] transition"
                    onMouseDown={e => onDragStart("left", e)}
                  />
                  {/* Center: Canvas */}
                  <div className="flex-1 min-w-0 min-h-0 flex flex-col relative">
                    <div className="flex-1 min-h-0">
                      <Canvas />
                    </div>
                    {/* AI Preview Modal */}
                    <AnimatePresence>
                      {aiPreview && (
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 40 }}
                          transition={{ duration: 0.22 }}
                          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
                        >
                          <div className="w-full max-w-2xl">
                            <AiUiPreview
                              tree={aiPreview}
                              onAccept={handleInsertTree}
                              onReject={() => { setAiPreview(null); setAiValidation(null); }}
                            />
                            {aiValidation && (aiValidation.errors.length > 0 || aiValidation.warnings.length > 0) && (
                              <div className="mt-4 p-3 rounded bg-[#2d2e4a] border border-[#a259ff] text-xs">
                                {aiValidation.errors.length > 0 && (
                                  <div className="text-red-400 font-bold mb-1">Errors:
                                    <ul className="list-disc ml-4">
                                      {aiValidation.errors.map((e, i) => <li key={i}>{e}</li>)}
                                    </ul>
                                  </div>
                                )}
                                {aiValidation.warnings.length > 0 && (
                                  <div className="text-yellow-300 font-bold">Warnings:
                                    <ul className="list-disc ml-4">
                                      {aiValidation.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {/* Right Resizer */}
                  <div
                    className="w-2 cursor-ew-resize bg-[#232347] hover:bg-[#a259ff] transition"
                    onMouseDown={e => onDragStart("right", e)}
                  />
                  {/* Right: Properties + AI Assistant */}
                  <div style={{ width: rightWidth, minWidth: 180 }} className="h-full flex-shrink-0 flex flex-col border-l border-[#232347] bg-[#18192a] relative">
                    <PropertiesPanel />
                    {/* AI Assistant Panel (right side) */}
                    <div className="flex-1 min-h-0 border-t border-[#232347]">
                      <AiUiAssistantPanel
                        onPreview={async (tree: any) => {
                          // Dynamically import validator (from backend, here stub)
                          const { AiUiValidator } = await import("../../../../backend/src/modules/ui-builder/AiUiValidator");
                          // Validate all aspects
                          const ct = AiUiValidator.validateComponentTypes(tree);
                          const pr = AiUiValidator.validateProps(tree);
                          const ly = AiUiValidator.validateLayout(tree);
                          const hi = AiUiValidator.validateHierarchy(tree);
                          const errors = [...ct.errors, ...pr.errors, ...ly.errors, ...hi.errors];
                          const warnings = [...ct.warnings, ...pr.warnings, ...ly.warnings, ...hi.warnings];
                          setAiPreview(tree);
                          setAiValidation({ errors, warnings });
                        }}
                      />
                    </div>
                  </div>
                </div>
                {/* Bottom Resizer */}
                <div
                  className="h-2 cursor-ns-resize bg-[#232347] hover:bg-[#a259ff] transition"
                  onMouseDown={e => onDragStart("bottom", e)}
                />
                {/* Bottom: ComponentTree (optional) */}
                <div style={{ height: bottomHeight, minHeight: 80 }} className="w-full border-t border-[#232347] bg-[#18192a]">
                  <ComponentTree />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DragDropProvider>
    </UIBuilderProvider>
  );
};
