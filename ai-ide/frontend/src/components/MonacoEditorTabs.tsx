export type { FileNode } from "./FileExplorer";
"use client";
import React, { useRef, useEffect, useState } from "react";
import MonacoEditor, { Monaco, OnChange, OnMount } from "@monaco-editor/react";
// Tabs UI import commented out: file does not exist
import { cn } from "@/lib/utils";
// Resizable UI import commented out: file does not exist

const neonCursorCSS = `
  .monaco-editor .cursor {
    box-shadow: 0 0 8px 2px #00fff7, 0 0 2px 1px #a259ff;
    background: #00fff7 !important;
  }
`;

export interface MonacoTab {
  id: string;
  label: string;
  language: string;
  value: string;
}

interface MonacoEditorTabsProps {
  tabs: MonacoTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  onChange: (id: string, value: string) => void;
  onSave?: (id: string, value: string) => void;
  onRun?: (id: string, value: string) => void;
  aiInsertCode?: string | null;
  aiReplaceCode?: string | null;
  onAICodeApplied?: () => void;
}

export const MonacoEditorTabs: React.FC<MonacoEditorTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onChange,
  onSave,
  onRun,
}) => {
  const editorRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);
  const [aiDecorations, setAIDecorations] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    // Inject neon cursor CSS
    const style = document.createElement("style");
    style.innerHTML = neonCursorCSS;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleEditorDidMount: OnMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.focus();

    // Inline suggestion stub
    editor.onDidChangeCursorPosition(() => {
      // In a real implementation, fetch AI suggestion here
    });
  };
  // Insert AI-generated code at cursor
  useEffect(() => {
    if (editorRef.current && props.aiInsertCode) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      editor.executeEdits("ai-insert", [
        {
          range: selection,
          text: props.aiInsertCode,
          forceMoveMarkers: true,
        },
      ]);
      // Highlight inserted code
      const endLine = selection.endLineNumber + props.aiInsertCode.split("\n").length - 1;
      const decoration = editor.deltaDecorations([], [
        {
          range: new editor.monaco.Range(selection.startLineNumber, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: "bg-[#00fff7]/10 border-l-4 border-neon-blue animate-pulse",
          },
        },
      ]);
      setAIDecorations(decoration);
      props.onAICodeApplied && props.onAICodeApplied();
    }
  }, [props.aiInsertCode]);

  // Replace selected code with AI-generated code
  useEffect(() => {
    if (editorRef.current && props.aiReplaceCode) {
      const editor = editorRef.current;
      const selection = editor.getSelection();
      editor.executeEdits("ai-replace", [
        {
          range: selection,
          text: props.aiReplaceCode,
          forceMoveMarkers: true,
        },
      ]);
      // Highlight replaced code
      const endLine = selection.startLineNumber + props.aiReplaceCode.split("\n").length - 1;
      const decoration = editor.deltaDecorations([], [
        {
          range: new editor.monaco.Range(selection.startLineNumber, 1, endLine, 1),
          options: {
            isWholeLine: true,
            className: "bg-[#a259ff]/10 border-l-4 border-neon-purple animate-pulse",
          },
        },
      ]);
      setAIDecorations(decoration);
      props.onAICodeApplied && props.onAICodeApplied();
    }
  }, [props.aiReplaceCode]);

  // Ghost text and inline suggestion stubs
  // In a real implementation, use Monaco's API for inline/ghost text

  const handleChange: OnChange = (value: any) => {
    if (activeTab && value !== undefined) {
      onChange(activeTab, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      if (onSave && activeTab) {
        onSave(activeTab, tabs.find(t => t.id === activeTab)?.value || "");
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (onRun && activeTab) {
        onRun(activeTab, tabs.find(t => t.id === activeTab)?.value || "");
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full w-full">
      <div className="flex flex-col" style={{ flex: 1 }}>
        <div className="bg-[#18192a] border-b border-[#282a36] flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={cn("text-[#a259ff] font-mono", activeTab === tab.id && "text-[#00fff7]")}
              onClick={() => onTabChange(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="h-full p-0">
          {tabs.map(tab => (
            tab.id === activeTab && (
              <div key={tab.id} className="h-[60vh]" onKeyDown={handleKeyDown} tabIndex={0}>
                <MonacoEditor
                  height="100%"
                  defaultLanguage={tab.language}
                  value={tab.value}
                  theme="vs-dark"
                  options={{
                    fontSize: 15,
                    fontFamily: 'JetBrains Mono, Fira Mono, monospace',
                    minimap: { enabled: false },
                    cursorBlinking: 'smooth',
                    cursorStyle: 'line',
                    smoothScrolling: true,
                    wordWrap: 'on',
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    tabSize: 2,
                    suggestOnTriggerCharacters: true,
                    quickSuggestions: true,
                    autoClosingBrackets: 'always',
                    autoClosingQuotes: 'always',
                    formatOnType: true,
                    formatOnPaste: true,
                    // Inline suggestion and ghost text stubs
                    inlineSuggest: true,
                  }}
                  onMount={handleEditorDidMount}
                  onChange={handleChange}
                />
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};
