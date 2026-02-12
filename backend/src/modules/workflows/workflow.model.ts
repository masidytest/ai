export interface Workflow {
  id: string;
  name: string;
  nodes: any[];
  connections: any[];
}

// In-memory placeholder
export const workflows: Workflow[] = [];
