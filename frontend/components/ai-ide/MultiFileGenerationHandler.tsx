"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GeneratedFile {
  path: string;
  content: string;
}

interface MultiFileGenerationHandlerProps {
  files: GeneratedFile[];
  open: boolean;
  onAccept: (accepted: GeneratedFile[]) => void;
  onReject: () => void;
}

export function MultiFileGenerationHandler({ files, open, onAccept, onReject }: MultiFileGenerationHandlerProps) {
  const [accepted, setAccepted] = useState(() => files.map(() => true));

  const handleToggle = (idx: number) => {
    setAccepted(prev => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const handleAccept = () => {
    onAccept(files.filter((_, i) => accepted[i]));
  };

  return (
    <Dialog open={open} onOpenChange={onReject}>
      <DialogContent className="bg-[#18102b] border border-[#2d1a5a] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AI Generated Multiple Files
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {files.map((file, idx) => (
            <Card key={file.path} className={`p-3 border ${accepted[idx] ? 'border-neon-blue' : 'border-gray-700'} bg-[#22134a]`}> 
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-purple-200 text-xs">{file.path}</span>
                <label className="flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={accepted[idx]} onChange={() => handleToggle(idx)} /> Accept
                </label>
              </div>
              <pre className="text-xs text-blue-200 whitespace-pre-wrap max-h-40 overflow-y-auto bg-[#18102b] rounded p-2">
                {file.content}
              </pre>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleAccept} className="bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg">Write Files</Button>
          <Button variant="ghost" onClick={onReject}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
