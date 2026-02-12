import React, { useState } from "react";
import { useUIBuilder } from "./UIBuilderContext";

function renderTree(components, selectedId, onSelect, onContextMenu, onDragStart, onDrop, level = 0) {
  return components.map(comp => (
    <div
      key={comp.id}
      className={`pl-${level * 4} py-1 flex items-center gap-1 cursor-pointer rounded transition bg-opacity-60 ${selectedId === comp.id ? "bg-[#232347] text-[#00fff7]" : "hover:bg-[#232347]"}`}
      draggable
      onDragStart={e => onDragStart(e, comp.id)}
      onDrop={e => onDrop(e, comp.id)}
      onDragOver={e => e.preventDefault()}
      onClick={e => { e.stopPropagation(); onSelect(comp.id); }}
      onContextMenu={e => { e.preventDefault(); onContextMenu(e, comp); }}
    >
      <span className="w-2 h-2 rounded-full bg-[#a259ff] mr-1" />
      <span className="truncate text-xs font-mono">{comp.type}</span>
      {comp.children && comp.children.length > 0 && (
        <div className="flex-1">
          {renderTree(comp.children, selectedId, onSelect, onContextMenu, onDragStart, onDrop, level + 1)}
        </div>
      )}
    </div>
  ));
}

export const ComponentTree: React.FC = () => {
  const { app, setApp, selectedIds, setSelectedIds } = useUIBuilder();
  const [contextMenu, setContextMenu] = useState(null);
  const [draggedId, setDraggedId] = useState(null);
  if (!app) return null;
  const selectedId = selectedIds?.[0];

  function handleSelect(id) {
    setSelectedIds([id]);
  }

  function handleContextMenu(e, comp) {
    setContextMenu({ x: e.clientX, y: e.clientY, comp });
  }

  function handleDragStart(e, id) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e, targetId) {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;
    // Flat reorder (nested reorder can be added)
    const idxFrom = app.components.findIndex(c => c.id === draggedId);
    const idxTo = app.components.findIndex(c => c.id === targetId);
    if (idxFrom === -1 || idxTo === -1) return;
    const newComps = [...app.components];
    const [moved] = newComps.splice(idxFrom, 1);
    newComps.splice(idxTo, 0, moved);
    setApp({ ...app, components: newComps });
    setDraggedId(null);
  }

  function handleMenuAction(action) {
    if (!contextMenu) return;
    const { comp } = contextMenu;
    if (action === "delete") {
      setApp({ ...app, components: app.components.filter(c => c.id !== comp.id) });
    } else if (action === "duplicate") {
      const newComp = { ...comp, id: `comp-${Date.now()}` };
      setApp({ ...app, components: [...app.components, newComp] });
    } else if (action === "rename") {
      const newName = prompt("Rename component", comp.type);
      if (newName) {
        setApp({ ...app, components: app.components.map(c => c.id === comp.id ? { ...c, type: newName } : c) });
      }
    }
    setContextMenu(null);
  }

  return (
    <div className="bg-[#18192a] border-r border-[#232347] w-56 p-2 text-white relative">
      <div className="font-bold text-[#a259ff] mb-2">Component Tree</div>
      <div className="overflow-y-auto max-h-[70vh]">
        {renderTree(app.components, selectedId, handleSelect, handleContextMenu, handleDragStart, handleDrop)}
      </div>
      {contextMenu && (
        <div
          className="absolute z-50 bg-[#232347] border border-[#a259ff] rounded shadow-lg text-xs"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button className="block w-full px-4 py-2 hover:bg-[#a259ff]" onClick={() => handleMenuAction("duplicate")}>Duplicate</button>
          <button className="block w-full px-4 py-2 hover:bg-[#a259ff]" onClick={() => handleMenuAction("rename")}>Rename</button>
          <button className="block w-full px-4 py-2 hover:bg-[#a259ff] text-red-400" onClick={() => handleMenuAction("delete")}>Delete</button>
        </div>
      )}
    </div>
  );
};
