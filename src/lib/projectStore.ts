// src/lib/projectStore.ts
// Project persistence — Supabase (primary) with localStorage fallback

import { supabase } from "./supabase";

export interface SavedProject {
  id: string;
  name: string;
  framework: string;
  status: "active" | "building" | "paused" | "error";
  env: string;
  createdAt: string;
  updatedAt: string;
  files: Array<{ name: string; language: string; content: string }>;
}

/* ── Map Supabase row → SavedProject ── */
function rowToProject(row: Record<string, unknown>): SavedProject {
  return {
    id: row.id as string,
    name: row.name as string,
    framework: (row.framework as string) || "HTML/CSS/JS",
    status: (row.status as SavedProject["status"]) || "active",
    env: (row.env as string) || "development",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    files: (row.files as SavedProject["files"]) || [],
  };
}

export const projectStore = {
  async list(): Promise<SavedProject[]> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []).map(rowToProject);
    } catch (err) {
      console.warn("Supabase list failed, falling back to localStorage:", err);
      return localFallback.list();
    }
  },

  async get(id: string): Promise<SavedProject | undefined> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data ? rowToProject(data) : undefined;
    } catch (err) {
      console.warn("Supabase get failed, falling back to localStorage:", err);
      return localFallback.get(id);
    }
  },

  async create(name: string, framework: string, files: SavedProject["files"] = []): Promise<SavedProject> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({ name, framework, status: "active", env: "development", files })
        .select()
        .single();
      if (error) throw error;
      const project = rowToProject(data);
      // Also save to localStorage as cache
      localFallback.save(project);
      return project;
    } catch (err) {
      console.warn("Supabase create failed, falling back to localStorage:", err);
      return localFallback.create(name, framework, files);
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      localFallback.delete(id);
    } catch (err) {
      console.warn("Supabase delete failed, falling back to localStorage:", err);
      localFallback.delete(id);
    }
  },

  async updateFiles(id: string, files: SavedProject["files"]): Promise<void> {
    try {
      const { error } = await supabase
        .from("projects")
        .update({ files, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      localFallback.updateFiles(id, files);
    } catch (err) {
      console.warn("Supabase updateFiles failed, falling back to localStorage:", err);
      localFallback.updateFiles(id, files);
    }
  },

  async save(project: SavedProject): Promise<SavedProject> {
    try {
      const { data, error } = await supabase
        .from("projects")
        .upsert({
          id: project.id,
          name: project.name,
          framework: project.framework,
          status: project.status,
          env: project.env,
          files: project.files,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
      if (error) throw error;
      const saved = rowToProject(data);
      localFallback.save(saved);
      return saved;
    } catch (err) {
      console.warn("Supabase save failed, falling back to localStorage:", err);
      return localFallback.save(project);
    }
  },
};

/* ── localStorage fallback (same as original) ── */
const STORAGE_KEY = "masidy-projects";

function readAll(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(projects: SavedProject[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

const localFallback = {
  list(): SavedProject[] {
    return readAll();
  },
  get(id: string): SavedProject | undefined {
    return readAll().find((p) => p.id === id);
  },
  save(project: SavedProject): SavedProject {
    const all = readAll();
    const idx = all.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      all[idx] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      all.unshift(project);
    }
    writeAll(all);
    return project;
  },
  create(name: string, framework: string, files: SavedProject["files"] = []): SavedProject {
    const now = new Date().toISOString();
    const project: SavedProject = {
      id: crypto.randomUUID(),
      name,
      framework,
      status: "active",
      env: "development",
      createdAt: now,
      updatedAt: now,
      files,
    };
    const all = readAll();
    all.unshift(project);
    writeAll(all);
    return project;
  },
  delete(id: string) {
    writeAll(readAll().filter((p) => p.id !== id));
  },
  updateFiles(id: string, files: SavedProject["files"]) {
    const all = readAll();
    const project = all.find((p) => p.id === id);
    if (project) {
      project.files = files;
      project.updatedAt = new Date().toISOString();
      writeAll(all);
    }
  },
};
