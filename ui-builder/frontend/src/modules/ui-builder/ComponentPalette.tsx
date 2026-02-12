
import React, { useState, useMemo } from "react";
import { useUIBuilder } from "./UIBuilderContext";
import { useDragDrop } from "./DragDropContext";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["Basic", "Layout", "Data", "Inputs", "Display"];

export const ComponentPalette: React.FC = () => {
  const { schemas } = useUIBuilder();
  const { setDraggingType } = useDragDrop();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let comps = schemas;
    if (activeCategory) {
      comps = comps.filter(s => (s as any).category === activeCategory);
    }
    if (search.trim()) {
      comps = comps.filter(s => s.displayName.toLowerCase().includes(search.toLowerCase()));
    }
    return comps;
  }, [schemas, search, activeCategory]);

  return (
    <div className="bg-[#18192a] p-2 border-r border-[#232347] w-56 flex flex-col">
      {/* Search Bar */}
      <input
        className="mb-2 px-2 py-1 rounded bg-[#232347] text-white border border-[#a259ff] focus:outline-none focus:ring-2 focus:ring-[#00fff7]"
        placeholder="Search components..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {/* Categories */}
      <div className="flex gap-1 mb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`px-2 py-1 rounded text-xs font-bold border transition-all duration-200 ${activeCategory === cat ? "bg-[#a259ff] text-white border-[#00fff7] shadow-[0_0_8px_#a259ff]" : "bg-[#232347] text-[#a259ff] border-[#232347] hover:bg-[#2d2e4a] hover:border-[#a259ff]"}`}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      {/* Component List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2">
        <AnimatePresence>
          {filtered.map(schema => (
            <motion.div
              key={schema.type}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 bg-[#232347] rounded px-2 py-1 text-white cursor-pointer border border-transparent hover:border-[#00fff7] hover:shadow-[0_0_8px_#00fff7,0_0_16px_#a259ff] hover:bg-[#232347]/80 transition-all duration-200 group"
              draggable
              onDragStart={() => setDraggingType(schema.type)}
              onDragEnd={() => setDraggingType(null)}
            >
              <span className="w-5 h-5 flex items-center justify-center text-[#a259ff] group-hover:scale-110 group-hover:text-[#00fff7] transition-transform duration-200">
                {schema.icon || <span className="rounded-full w-3 h-3 bg-[#a259ff] inline-block" />}
              </span>
              <span className="font-medium text-sm group-hover:text-[#00fff7] transition-colors duration-200">{schema.displayName}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
