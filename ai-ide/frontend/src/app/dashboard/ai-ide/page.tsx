"use client";
import React, { useEffect, useState, useCallback } from "react";
import { IdeLayout } from "../../../components/IdeLayout";
import { projectManager } from "../../../services/ProjectManager";
import { FileNode } from "../../../components/FileExplorer";
import { MonacoTab } from "../../../components/MonacoEditorTabs";
import axios from "axios";

export default function AiIdePage() {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [tabs, setTabs] = useState<MonacoTab[]>([]);
  const [activeTab, setActiveTab] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  // Load project on mount
  useEffect(() => {
    async function load() {
      let project = null;
      if (!projectId) {
        project = await projectManager.createProject("My AI IDE Project");
        setProjectId(project.id);
      } else {
        project = await projectManager.loadProject(projectId);
      }
      setFiles(projectManager.getFileTree());
    }
    load();
  }, [projectId]);

  // File select handler
  const handleFileSelect = useCallback(async (id: string) => {
    const file = projectManager.project?.files[id];
    if (!file) return;
    if (!tabs.find(t => t.id === id)) {
      setTabs(tabs => [...tabs, { id, label: file.path.split("/").pop() || id, language: getLanguage(file.path), value: file.content }]);
    }
    setActiveTab(id);
  }, [tabs]);

  // Tab change handler
  const handleTabChange = (id: string) => setActiveTab(id);

  // Tab content change handler
  const handleTabChangeContent = (id: string, value: string) => {
    setTabs(tabs => tabs.map(t => t.id === id ? { ...t, value } : t));
    projectManager.saveFile(id, value);
  };

  // Save handler
  const handleSave = (id: string, value: string) => {
    projectManager.saveFile(id, value);
  };

  // Run handler
  const handleRun = async (id: string, value: string) => {
    const tab = tabs.find(t => t.id === id);
    if (!tab) return;
    setStdout(""); setStderr("");
    const res = await axios.post<{ stdout: string; stderr: string }>("/ai-ide/run", { language: tab.language, code: value });
    setStdout(res.data.stdout);
    setStderr(res.data.stderr);
  };

  // New file/folder/delete handlers
  const handleNewFile = (parentId: string | null) => {/* Implement as needed */};
  const handleNewFolder = (parentId: string | null) => {/* Implement as needed */};
  const handleDelete = (id: string) => {/* Implement as needed */};

  // Console clear
  const handleClearConsole = () => { setStdout(""); setStderr(""); };

  // Insert code from AI assistant
  const handleInsertCode = (code: string) => {
    if (!activeTab) return;
    setTabs(tabs => tabs.map(t => t.id === activeTab ? { ...t, value: t.value + "\n" + code } : t));
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#18192a] via-[#232347] to-[#10111a]">
      <IdeLayout
        files={files}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onFileSelect={handleFileSelect}
        onTabChangeContent={handleTabChangeContent}
        onSave={handleSave}
        onRun={handleRun}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
        onDelete={handleDelete}
        stdout={stdout}
        stderr={stderr}
        onClearConsole={handleClearConsole}
        onInsertCode={handleInsertCode}
      />
    </div>
  );
}

function getLanguage(path: string) {
  if (path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".js")) return "javascript";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".md")) return "markdown";
  return "plaintext";
}
