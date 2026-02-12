"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiffEditor } from "@monaco-editor/react";

interface FileDiff {
  path: string;
  original: string;
  modified: string;
  language: string;
}

interface AiCodePreviewModalProps {
  open: boolean;
  files: FileDiff[];
  onAccept: (file: FileDiff) => void;
  onReject: () => void;
}

export function AiCodePreviewModal({ open, files, onAccept, onReject }: AiCodePreviewModalProps) {
  const [selected, setSelected] = useState(0);
  const file = files[selected];

  return (
    <Dialog open={open} onOpenChange={onReject}>
      <DialogContent className="bg-[#18102b] border border-[#2d1a5a] text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Code Preview
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Tabs value={String(selected)} onValueChange={v => setSelected(Number(v))}>
            <TabsList className="bg-[#22134a] border border-[#2d1a5a]">
              {files.map((f, i) => (
                <TabsTrigger key={f.path} value={String(i)} className="font-mono text-xs text-purple-200">
                  {f.path}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <Card className="p-2 bg-[#18102b] border border-[#2d1a5a]">
          <DiffEditor
            height="40vh"
            original={file.original}
            modified={file.modified}
            language={file.language}
            theme="vs-dark"
            options={{
              renderSideBySide: true,
              fontSize: 14,
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
            }}
          />
        </Card>
        <DialogFooter>
          <Button onClick={() => onAccept(file)} className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">Accept</Button>
          <Button variant="ghost" onClick={onReject}>Reject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
