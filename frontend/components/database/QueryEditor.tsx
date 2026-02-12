"use client";
import React, { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(
  () => import("@monaco-editor/react").then(mod => mod.default),
  { ssr: false }
);

interface QueryEditorProps {
  databaseId: string;
  onResult: (result: any) => void;
}

export function QueryEditor({ databaseId, onResult }: QueryEditorProps) {
  const [sql, setSql] = useState("SELECT * FROM users;");
  const [loading, setLoading] = useState(false);
  const editorRef = useRef<any>(null);

  // Keyboard shortcut: Ctrl+Enter
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runQuery();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [sql]);

  // Monaco stub autocomplete (no real backend)
  function handleEditorWillMount(monaco: any) {
    monaco.languages.registerCompletionItemProvider("sql", {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: "SELECT",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "SELECT ",
            },
            {
              label: "FROM",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "FROM ",
            },
            {
              label: "WHERE",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: "WHERE ",
            },
          ],
        };
      },
    });
  }

  async function runQuery() {
    setLoading(true);
    try {
      const res = await fetch(`/api/databases/${databaseId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sql }),
      });
      const data = await res.json();
      onResult(data);
    } catch (err) {
      onResult({ error: "Query failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4 mb-4 bg-[#18102b] border border-[#2d1a5a]">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-purple-300">Query Editor</h2>
        <Button
          size="sm"
          className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:from-purple-500 hover:to-blue-500 flex items-center gap-2"
          onClick={runQuery}
          disabled={loading}
        >
          <Play size={16} /> Run (Ctrl+Enter)
        </Button>
      </div>
      <div className="rounded overflow-hidden border border-[#2d1a5a]">
        <MonacoEditor
          height="180px"
          defaultLanguage="sql"
          value={sql}
          onChange={v => setSql(v || "")}
          options={{
            theme: "vs-dark",
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            suggestOnTriggerCharacters: true,
            tabSize: 2,
          }}
          beforeMount={handleEditorWillMount}
          onMount={editor => (editorRef.current = editor)}
        />
      </div>
    </Card>
  );
}
