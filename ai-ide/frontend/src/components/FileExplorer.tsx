"use client";
import React, { useState } from "react";
import { FaFolder, FaFolderOpen, FaFileCode, FaFileAlt, FaTrash, FaPlus, FaFolderPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileExplorerProps {
  tree: FileNode[];
  onFileSelect: (id: string) => void;
  onNewFile: (parentId: string | null) => void;
  onNewFolder: (parentId: string | null) => void;
  onDelete: (id: string) => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  tree,
  onFileSelect,
  onNewFile,
  onNewFolder,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; id: string | null } | null>(null);

  const handleToggle = (id: string) => {
    setExpanded(e => ({ ...e, [id]: !e[id] }));
  };

  const handleContextMenu = (e: React.MouseEvent, id: string | null) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, id });
  };

  const handleMenuAction = (action: string) => {
    if (!contextMenu) return;
    if (action === "new-file") onNewFile(contextMenu.id);
    if (action === "new-folder") onNewFolder(contextMenu.id);
    if (action === "delete" && contextMenu.id) onDelete(contextMenu.id);
    setContextMenu(null);
  };

  const renderIcon = (node: FileNode) => {
    if (node.type === "folder") return expanded[node.id] ? <FaFolderOpen className="text-yellow-400" /> : <FaFolder className="text-yellow-600" />;
    if (node.name.match(/\.(js|ts|tsx|jsx)$/)) return <FaFileCode className="text-blue-400" />;
    return <FaFileAlt className="text-gray-400" />;
  };

  const renderTree = (nodes: FileNode[], parentId: string | null = null, depth = 0) => (
    <ul className="pl-2 select-none">
      <AnimatePresence initial={false}>
        {nodes.map(node => (
          <motion.li
            key={node.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1 py-0.5 group relative"
            onContextMenu={e => handleContextMenu(e, node.id)}
            draggable={false}
          >
            <span
              className="flex items-center gap-1 cursor-pointer hover:bg-[#232347] px-1 rounded"
              style={{ paddingLeft: depth * 12 }}
              onClick={() => node.type === "file" ? onFileSelect(node.id) : handleToggle(node.id)}
            >
              {renderIcon(node)}
              <span className="truncate max-w-[120px] text-sm text-white/90">{node.name}</span>
            </span>
            {node.type === "folder" && (
              <span
                className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#00fff7] cursor-pointer"
                onClick={e => { e.stopPropagation(); onNewFile(node.id); }}
                title="New File"
              >
                <FaPlus />
              </span>
            )}
            {node.type === "folder" && (
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#a259ff] cursor-pointer ml-1"
                onClick={e => { e.stopPropagation(); onNewFolder(node.id); }}
                title="New Folder"
              >
                <FaFolderPlus />
              </span>
            )}
            <span
              className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400 cursor-pointer ml-1"
              onClick={e => { e.stopPropagation(); onDelete(node.id); }}
              title="Delete"
            >
              <FaTrash />
            </span>
            {node.type === "folder" && node.children && expanded[node.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="w-full"
              >
                {renderTree(node.children, node.id, depth + 1)}
              </motion.div>
            )}
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );

  return (
    <div className="bg-[#18192a] text-white w-full h-full relative" onContextMenu={e => handleContextMenu(e, null)}>
      {renderTree(tree)}
      {contextMenu && (
        <div
          className="fixed z-50 bg-[#232347] border border-[#282a36] rounded shadow-lg text-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onMouseLeave={() => setContextMenu(null)}
        >
          <div className="px-3 py-2 hover:bg-[#282a36] cursor-pointer" onClick={() => handleMenuAction("new-file")}>New File</div>
          <div className="px-3 py-2 hover:bg-[#282a36] cursor-pointer" onClick={() => handleMenuAction("new-folder")}>New Folder</div>
          {contextMenu.id && <div className="px-3 py-2 hover:bg-[#282a36] cursor-pointer text-red-400" onClick={() => handleMenuAction("delete")}>Delete</div>}
        </div>
      )}
    </div>
  );
};
