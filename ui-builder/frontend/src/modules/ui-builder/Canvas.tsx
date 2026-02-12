

import { useEffect, useRef, useState } from "react";
import { useUiBuilderProjectManager } from "./UiBuilderProjectManager";

export default function Canvas() {
  // UI state and context
  const { app, setApp, selectedId, setSelectedId, selectedIds, setSelectedIds } = useUIBuilder();
  const { draggingType, setDraggingType } = useDragDrop();
  const { undo, redo, canUndo, canRedo } = useUiBuilderProjectManager?.() || {};
  const [aiGeneratedIds, setAiGeneratedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState<any>(null);
  const [selectBox, setSelectBox] = useState<any>(null);
  const [resizing, setResizing] = useState<any>(null);
  const [draggingCompId, setDraggingCompId] = useState<string|null>(null);
  const [dragOffset, setDragOffset] = useState<{x:number,y:number}|null>(null);
  const [multiDragOffsets, setMultiDragOffsets] = useState<Record<string, {x:number,y:number}>>({});
  const canvasRef = useRef<HTMLDivElement>(null);

  function handleDrop(e: React.DragEvent) {/* ...implement as before... */}
  function handleDragOver(e: React.DragEvent) {/* ...implement as before... */}
  function handleSelect(id: string, e: React.MouseEvent) {/* ...implement as before... */}
  function handleMouseDown(e: React.MouseEvent, id: string) {
    setDraggingCompId(id);
    setDragOffset({
      x: e.clientX - (app.components.find(c => c.id === id)?.props.x || 0),
      y: e.clientY - (app.components.find(c => c.id === id)?.props.y || 0)
    });
    // If multi-select, store offsets for all selected
    if (selectedIds.length > 1 && selectedIds.includes(id)) {
      const offsets: Record<string, {x: number, y: number}> = {};
      selectedIds.forEach(sid => {
        const c = app.components.find(c2 => c2.id === sid);
        if (c) offsets[sid] = { x: (c.props.x || 0) - (app.components.find(c2 => c2.id === id)?.props.x || 0), y: (c.props.y || 0) - (app.components.find(c2 => c2.id === id)?.props.y || 0) };
      });
      setMultiDragOffsets(offsets);
    } else {
      setMultiDragOffsets({});
    }
  }
  function handleMouseMove(e: React.MouseEvent) {/* ...implement as before... */}
  function handleMouseUp(e: React.MouseEvent) {/* ...implement as before... */}

  // ...other handlers as needed...

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full bg-[#18192a] overflow-hidden select-none"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
      onWheel={e => {
        if (e.ctrlKey) {
          setZoom(z => Math.max(0.2, Math.min(2, z - e.deltaY * 0.001)));
        } else {
          setPan(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }));
        }
      }}
      onMouseDown={e => {
        if (e.button === 1) {
          setPanning({ startX: e.clientX, startY: e.clientY, origX: pan.x, origY: pan.y });
        } else if (e.target === canvasRef.current) {
          const rect = canvasRef.current!.getBoundingClientRect();
          const startX = (e.clientX - rect.left - pan.x) / zoom;
          const startY = (e.clientY - rect.top - pan.y) / zoom;
          setSelectBox({ x: startX, y: startY, w: 0, h: 0 });
        }
      }}
      style={{ cursor: selectBox ? "crosshair" : panning ? "grabbing" : "default" }}
    >
      <GridOverlay gridSize={8} />
      <div className="absolute inset-0 pointer-events-none border-2 border-[#a259ff] rounded-lg opacity-20" />
      <div
        className="absolute top-0 left-0"
        style={{ transform: `scale(${zoom}) translate(${pan.x / zoom}px,${pan.y / zoom}px)` }}
      >
        <AnimatePresence>
          {app?.components.map(comp => {
            const isSelected = selectedIds.includes(comp.id);
            const isAi = aiGeneratedIds.includes(comp.id);
            return (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.18 }}
                className={`absolute border ${isSelected ? "border-[#00fff7] shadow-lg" : isAi ? "border-[#00fff7] border-dashed shadow-[0_0_8px_#00fff7]" : "border-[#232347]"} bg-[#232347] rounded cursor-move ${isAi ? "ring-2 ring-[#00fff7] ring-offset-2" : ""}`}
                style={{
                  left: comp.props.x || 0,
                  top: comp.props.y || 0,
                  width: comp.props.w || 96,
                  height: comp.props.h || 48,
                  zIndex: isSelected ? 10 : 1
                }}
                onClick={e => { e.stopPropagation(); handleSelect(comp.id, e); }}
                onMouseDown={e => handleMouseDown(e, comp.id)}
              >
                <span className="text-xs text-[#a259ff] px-2">{comp.type}</span>
                {isAi && <span className="absolute right-2 top-2 text-[#00fff7] text-[10px]">AI</span>}
                {isSelected && (
                  <>
                    {/* Resize handle */}
                    <div
                      className="absolute right-0 bottom-0 w-3 h-3 bg-[#a259ff] rounded cursor-se-resize"
                      onMouseDown={e => {
                        e.stopPropagation();
                        const rect = canvasRef.current?.getBoundingClientRect();
                        setResizing({
                          id: comp.id,
                          startX: rect ? comp.props.x + (comp.props.w || 96) : 0,
                          startY: rect ? comp.props.y + (comp.props.h || 48) : 0,
                          startW: comp.props.w || 96,
                          startH: comp.props.h || 48
                        });
                      }}
                    />
                    {/* Move handle */}
                    <div
                      className="absolute left-1 top-1 w-3 h-3 bg-[#00fff7] rounded cursor-move"
                      onMouseDown={e => {
                        e.stopPropagation();
                        setDraggingCompId(comp.id);
                        setDragOffset({
                          x: e.clientX - (comp.props.x || 0),
                          y: e.clientY - (comp.props.y || 0)
                        });
                      }}
                    />
                  </>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Selection box */}
      {selectBox && (
        <div
          className="absolute border-2 border-[#00fff7] bg-[#00fff7]/10 pointer-events-none"
          style={{
            left: Math.min(selectBox.x, selectBox.x + selectBox.w) * zoom + pan.x,
            top: Math.min(selectBox.y, selectBox.y + selectBox.h) * zoom + pan.y,
            width: Math.abs(selectBox.w) * zoom,
            height: Math.abs(selectBox.h) * zoom,
          }}
        />
      )}
      {/* Zoom controls */}
      <div className="absolute bottom-2 right-2 flex gap-2 bg-[#232347] rounded px-2 py-1 text-white text-xs shadow-lg">
        <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))} className="hover:text-[#00fff7]">-</button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="hover:text-[#00fff7]">+</button>
      </div>
      <div className="absolute top-2 left-2 text-[#a259ff] text-xs flex gap-2 items-center">
        Canvas (Drag, select, move, grid, resize, multi-select, zoom/pan, Framer Motion)
        {canUndo && <button onClick={undo} className="ml-2 px-2 py-1 rounded bg-[#232347] border border-[#a259ff] text-[#a259ff] hover:bg-[#a259ff] hover:text-white transition text-xs">Undo</button>}
        {canRedo && <button onClick={redo} className="ml-2 px-2 py-1 rounded bg-[#232347] border border-[#00fff7] text-[#00fff7] hover:bg-[#00fff7] hover:text-[#18192a] transition text-xs">Redo</button>}
      </div>
    </div>
  );
}
