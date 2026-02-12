import { workflows, Workflow } from './workflow.model';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';

const ajv = new Ajv();
const nodeSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    config: { type: 'object' },
  },
  required: ['id', 'type', 'config'],
  additionalProperties: true,
};

export class WorkflowService {
  static listWorkflows(): Workflow[] {
    return workflows;
  }

  static createWorkflow(data: { name: string; nodes: any[]; connections: any[] }): Workflow {
    // Validate nodes
    for (const node of data.nodes) {
      const valid = ajv.validate(nodeSchema, node);
      if (!valid) throw new Error('Invalid node schema');
    }
    const workflow: Workflow = {
      id: uuidv4(),
      name: data.name,
      nodes: data.nodes,
      connections: data.connections,
    };
    workflows.push(workflow);
    return workflow;
  }

  static runWorkflow(id: string): any {
    // Placeholder for node execution engine
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) throw new Error('Workflow not found');
    // Simulate execution
    return { status: 'success', workflowId: id };
  }
}
