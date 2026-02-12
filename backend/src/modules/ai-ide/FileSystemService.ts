// In-memory file system and project manager for AI IDE

interface FileEntry {
  content: string;
  path: string;
}

interface Project {
  id: string;
  name: string;
  files: Record<string, FileEntry>;
}

class FileSystemService {
  private files: Record<string, FileEntry> = {};
  private projects: Record<string, Project> = {};
  private projectCounter = 1;

  readFile(path: string): string | undefined {
    return this.files[path]?.content;
  }

  writeFile(path: string, content: string): void {
    this.files[path] = { path, content };
  }

  deleteFile(path: string): void {
    delete this.files[path];
  }

  listFiles(directory: string): string[] {
    const prefix = directory.endsWith('/') ? directory : directory + '/';
    return Object.keys(this.files).filter(f => f.startsWith(prefix));
  }

  createProject(name: string): Project {
    const id = `project-${this.projectCounter++}`;
    const project: Project = { id, name, files: {} };
    this.projects[id] = project;
    return project;
  }

  loadProject(id: string): Project | undefined {
    return this.projects[id];
  }
}

export const fileSystemService = new FileSystemService();
