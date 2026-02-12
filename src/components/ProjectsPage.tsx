"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { projectStore, SavedProject } from "@/lib/projectStore";

const statusColor: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500",
  building: "bg-blue-500/10 text-blue-400",
  paused: "bg-amber-500/10 text-amber-500",
  error: "bg-red-500/10 text-red-400",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function ProjectsPage() {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [newName, setNewName] = useState("");
  const [newFramework, setNewFramework] = useState("Next.js");
  const router = useRouter();

  // Load projects from Supabase (with localStorage fallback)
  const loadProjects = useCallback(async () => {
    const list = await projectStore.list();
    setProjects(list);
  }, []);

  useEffect(() => {
    loadProjects();
    // Re-check when tab regains focus (e.g. after building in IDE)
    const onFocus = () => { loadProjects(); };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [loadProjects]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const project = await projectStore.create(newName.trim(), newFramework);
    setNewName("");
    setShowCreate(false);
    // Open the new project in the IDE
    router.push(`/dashboard/ai-ide?projectId=${project.id}`);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await projectStore.delete(id);
    await loadProjects();
  };

  const openProject = (project: SavedProject) => {
    router.push(`/dashboard/ai-ide?projectId=${project.id}`);
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-app-text">Projects</h1>
          <p className="text-app-text-muted mt-1">Manage and monitor all your projects</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-app-card border border-app-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView("grid")}
              className={`p-2 transition-colors ${view === "grid" ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 transition-colors ${view === "list" ? "bg-app-accent/15 text-app-accent-text" : "text-app-text-muted hover:text-app-text"}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowCreate(!showCreate)}
            className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Project
          </motion.button>
        </div>
      </div>

      {/* Create panel */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-app-card border border-app-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-app-text mb-4">Create New Project</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-app-text-secondary mb-1.5">Project Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    placeholder="my-project"
                    className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text placeholder:text-app-text-muted focus:outline-none focus:border-app-accent/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-app-text-secondary mb-1.5">Framework</label>
                  <select
                    value={newFramework}
                    onChange={(e) => setNewFramework(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-app-bg border border-app-border text-app-text focus:outline-none focus:border-app-accent/50 transition-colors"
                  >
                    <option>Next.js</option>
                    <option>React</option>
                    <option>Node.js</option>
                    <option>Python</option>
                    <option>React Native</option>
                    <option>HTML/CSS/JS</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="w-full px-4 py-2 rounded-lg bg-app-btn-primary text-app-btn-primary-text font-medium hover:bg-app-btn-primary-hover transition-colors disabled:opacity-40"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full sm:max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-app-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-app-card border border-app-border text-app-text placeholder:text-app-text-muted focus:outline-none focus:border-app-accent/50 transition-colors"
          />
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              className="bg-app-card border border-app-border rounded-2xl p-6 hover:border-app-accent/30 hover:shadow-lg transition-all cursor-pointer group relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => openProject(project)}
            >
              {/* Delete button */}
              <button
                onClick={(e) => handleDelete(project.id, e)}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-app-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete project"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-app-accent/10 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-app-text group-hover:text-app-accent-text transition-colors">{project.name}</h3>
                    <span className="text-xs text-app-text-muted">{project.files.length} files</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-app-text-muted">Framework</span>
                  <p className="text-app-text font-medium">{project.framework}</p>
                </div>
                <div>
                  <span className="text-app-text-muted">Environment</span>
                  <p className="text-app-text font-medium">{project.env}</p>
                </div>
                <div>
                  <span className="text-app-text-muted">Created</span>
                  <p className="text-app-text font-medium">{timeAgo(project.createdAt)}</p>
                </div>
                <div>
                  <span className="text-app-text-muted">Updated</span>
                  <p className="text-app-text font-medium">{timeAgo(project.updatedAt)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-app-card border border-app-border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-app-border">
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider">Framework</th>
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider">Files</th>
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider">Updated</th>
                <th className="px-6 py-3 text-xs font-semibold text-app-text-muted uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((project, i) => (
                <motion.tr
                  key={project.id}
                  className="border-b border-app-border/50 hover:bg-app-accent/5 transition-colors cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => openProject(project)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-app-accent/10 flex items-center justify-center">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--app-accent)" strokeWidth="1.8" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                      </div>
                      <div className="font-medium text-app-text">{project.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-app-text-secondary">{project.framework}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[project.status]}`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-app-text-secondary">{project.files.length} files</td>
                  <td className="px-6 py-4 text-sm text-app-text-secondary">{timeAgo(project.updatedAt)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={(e) => handleDelete(project.id, e)}
                      className="p-1.5 rounded-lg text-app-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete project"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <svg className="mx-auto mb-4 text-app-text-muted" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
          <p className="text-app-text-muted mb-4">
            {search ? "No projects found matching your search." : "No projects yet. Create your first project!"}
          </p>
          {!search && (
            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 rounded-xl bg-app-btn-primary text-app-btn-primary-text font-semibold hover:bg-app-btn-primary-hover transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      )}
    </div>
  );
}
