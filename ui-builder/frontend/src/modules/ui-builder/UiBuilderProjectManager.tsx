import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface UiBuilderProjectManagerContextProps {
  appId: string | null;
  appData: any;
  loadApp: (id: string) => Promise<void>;
  saveApp: (id: string, data: any) => Promise<void>;
  publishApp: (id: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  setAppData: (data: any) => void;
}

const UiBuilderProjectManagerContext = createContext<UiBuilderProjectManagerContextProps | undefined>(undefined);

export const useUiBuilderProjectManager = () => {
  const ctx = useContext(UiBuilderProjectManagerContext);
  if (!ctx) throw new Error("Must be used within UiBuilderProjectManagerProvider");
  return ctx;
};

export const UiBuilderProjectManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appId, setAppId] = useState<string | null>(null);
  const [appData, setAppData] = useState<any>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  // Load app
  const loadApp = async (id: string) => {
    // Replace with real API call
    const data = JSON.parse(localStorage.getItem(`uibuilder-app-${id}`) || "null") || { id, components: [] };
    setAppId(id);
    setAppData(data);
    setUndoStack([]);
    setRedoStack([]);
  };

  // Save app
  const saveApp = async (id: string, data: any) => {
    // Replace with real API call
    localStorage.setItem(`uibuilder-app-${id}`, JSON.stringify(data));
  };

  // Publish app
  const publishApp = async (id: string) => {
    // Replace with real API call
    alert(`App ${id} published!`);
  };

  // Undo/redo
  const undo = () => {
    if (undoStack.length === 0) return;
    setRedoStack([appData, ...redoStack]);
    setAppData(undoStack[0]);
    setUndoStack(undoStack.slice(1));
  };
  const redo = () => {
    if (redoStack.length === 0) return;
    setUndoStack([appData, ...undoStack]);
    setAppData(redoStack[0]);
    setRedoStack(redoStack.slice(1));
  };

  // Track changes for undo
  useEffect(() => {
    if (!appData) return;
    setUndoStack(stack => [appData, ...stack].slice(0, 50));
    // eslint-disable-next-line
  }, [JSON.stringify(appData)]);

  // Auto-save every 5s
  useEffect(() => {
    if (!appId || !appData) return;
    if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    autoSaveTimer.current = setInterval(() => {
      saveApp(appId, appData);
    }, 5000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [appId, appData]);

  return (
    <UiBuilderProjectManagerContext.Provider
      value={{
        appId,
        appData,
        loadApp,
        saveApp,
        publishApp,
        undo,
        redo,
        canUndo: undoStack.length > 0,
        canRedo: redoStack.length > 0,
        setAppData,
      }}
    >
      {children}
    </UiBuilderProjectManagerContext.Provider>
  );
};
