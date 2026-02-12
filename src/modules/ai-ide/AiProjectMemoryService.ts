// src/modules/ai-ide/AiProjectMemoryService.ts
// AI Project Memory Service (in-memory stub)

type ProjectMemory = {
  patterns?: string[];
  namingConventions?: string[];
  folderStructure?: string[];
  techStack?: string[];
};

const memoryStore: Record<string, ProjectMemory> = {};

export class AiProjectMemoryService {
  static rememberProjectPatterns(projectId: string, patterns: string[]) {
    if (!memoryStore[projectId]) memoryStore[projectId] = {};
    memoryStore[projectId].patterns = patterns;
  }

  static rememberNamingConventions(projectId: string, conventions: string[]) {
    if (!memoryStore[projectId]) memoryStore[projectId] = {};
    memoryStore[projectId].namingConventions = conventions;
  }

  static rememberFolderStructure(projectId: string, structure: string[]) {
    if (!memoryStore[projectId]) memoryStore[projectId] = {};
    memoryStore[projectId].folderStructure = structure;
  }

  static rememberTechStack(projectId: string, techStack: string[]) {
    if (!memoryStore[projectId]) memoryStore[projectId] = {};
    memoryStore[projectId].techStack = techStack;
  }

  static getMemory(projectId: string): ProjectMemory {
    return memoryStore[projectId] || {};
  }
}
