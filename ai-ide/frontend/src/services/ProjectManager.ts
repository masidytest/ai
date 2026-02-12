import axios from "axios";
import { FileNode, MonacoTab } from "../components/MonacoEditorTabs";

export interface Project {
  id: string;
  name: string;
  files: Record<string, { path: string; content: string }>;
}

class ProjectManager {
  project: Project | null = null;
  openTabs: MonacoTab[] = [];
  activeTab: string = "";


  async loadProject(id: string): Promise<Project | null> {
    const res = await axios.get(`/ai-ide/project/${id}`);
    this.project = res.data as Project;
    return this.project;
  }

  async createProject(name: string): Promise<Project> {
    const res = await axios.post(`/ai-ide/project`, { name });
    this.project = res.data as Project;
    return this.project!;
  }

  getFileTree(): FileNode[] {
    if (!this.project) return [];
    // Flat to tree conversion (simple, assumes / as separator)
    const files = Object.values(this.project.files);
    const root: FileNode = { id: "root", name: this.project.name, type: "folder", children: [] };
    files.forEach(f => {
      const parts = f.path.split("/");
      let node = root;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        let child = node.children!.find((c: any) => c.name === part);
        if (!child) {
          child = {
            id: parts.slice(0, i + 1).join("/"),
            name: part,
            type: i === parts.length - 1 ? "file" : "folder",
            ...(i === parts.length - 1 ? {} : { children: [] })
          } as FileNode;
          node.children!.push(child);
        }
        node = child;
      }
    });
    return root.children || [];
  }

  async saveFile(path: string, content: string) {
    if (!this.project) return;
    await axios.post(`/api/files/${encodeURIComponent(path)}`, { content });
    if (this.project.files[path]) this.project.files[path].content = content;
  }

  syncTabs(tabs: MonacoTab[]) {
    this.openTabs = tabs;
  }

  setActiveTab(id: string) {
    this.activeTab = id;
  }
}

export const projectManager = new ProjectManager();
