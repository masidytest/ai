import React, { createContext, useContext, useState } from "react";
import { AppModel, UIComponent, ComponentSchema } from "./types";

interface UIBuilderContextProps {
  app: AppModel | null;
  setApp: (app: AppModel | null) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  schemas: ComponentSchema[];
  setSchemas: (schemas: ComponentSchema[]) => void;
}

const UIBuilderContext = createContext<UIBuilderContextProps | undefined>(undefined);

export const UIBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [app, setApp] = useState<AppModel | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<ComponentSchema[]>([]);

  return (
    <UIBuilderContext.Provider value={{ app, setApp, selectedId, setSelectedId, selectedIds, setSelectedIds, schemas, setSchemas }}>
      {children}
    </UIBuilderContext.Provider>
  );
};

export function useUIBuilder() {
  const ctx = useContext(UIBuilderContext);
  if (!ctx) throw new Error("useUIBuilder must be used within UIBuilderProvider");
  return ctx;
}
