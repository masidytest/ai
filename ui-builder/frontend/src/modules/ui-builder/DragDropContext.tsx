import React, { createContext, useContext, useState } from "react";

interface DragDropContextProps {
  draggingType: string | null;
  setDraggingType: (type: string | null) => void;
}

const DragDropContext = createContext<DragDropContextProps | undefined>(undefined);

export const DragDropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [draggingType, setDraggingType] = useState<string | null>(null);
  return (
    <DragDropContext.Provider value={{ draggingType, setDraggingType }}>
      {children}
    </DragDropContext.Provider>
  );
};

export function useDragDrop() {
  const ctx = useContext(DragDropContext);
  if (!ctx) throw new Error("useDragDrop must be used within DragDropProvider");
  return ctx;
}
