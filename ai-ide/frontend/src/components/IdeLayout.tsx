"use client";
import React, { useState } from "react";
import { FileExplorer, FileNode } from "./FileExplorer";
import { MonacoEditorTabs, MonacoTab } from "./MonacoEditorTabs";
import { AiAssistantPanel } from "./AiAssistantPanel";
import { ConsolePanel } from "./ConsolePanel";
// import { Resizable, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { motion } from "framer-motion";

interface IdeLayoutProps {
  files: FileNode[];
  tabs: MonacoTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onFileSelect: (id: string) => void;
  onTabChangeContent: (id: string, value: string) => void;
  onSave: (id: string, value: string) => void;
  onRun: (id: string, value: string) => void;
  onNewFile: (parentId: string | null) => void;
  onNewFolder: (parentId: string | null) => void;
  onDelete: (id: string) => void;
  stdout: string;
  stderr?: string;
  onClearConsole: () => void;
  onInsertCode: (code: string) => void;
}

export const IdeLayout: React.FC<IdeLayoutProps> = ({
  files,
  tabs,
  activeTab,
  onTabChange,
  onFileSelect,
  onTabChangeContent,
  onSave,
  onRun,
  onNewFile,
  onNewFolder,
  onDelete,
  stdout,
  stderr,
  onClearConsole,
  onInsertCode,
}) => {
  return (
    <div className="flex h-screen w-screen bg-[#10111a]">
      {/* File Explorer */}
      <div className="border-r border-[#232347] bg-[#18192a]" style={{ width: '16%' }}>
        <FileExplorer
          tree={files}
          onFileSelect={onFileSelect}
          onNewFile={onNewFile}
          onNewFolder={onNewFolder}
          onDelete={onDelete}
        />
      </div>
      {/* Center: Monaco Editor */}
      <div className="flex flex-col" style={{ width: '52%' }}>
        <div className="flex-1 min-h-0">
          <MonacoEditorTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            onChange={onTabChangeContent}
            onSave={onSave}
            onRun={onRun}
          />
        </div>
        <motion.div layout className="h-48">
          <ConsolePanel stdout={stdout} stderr={stderr} onClear={onClearConsole} />
        </motion.div>
      </div>
      {/* Right: AI Assistant */}
      <div className="border-l border-[#232347] bg-[#18192a]" style={{ width: '22%' }}>
        <AiAssistantPanel onInsertCode={onInsertCode} />
      </div>
    </div>
  );
};
