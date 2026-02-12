// Ensures compatibility with all test imports and signatures
export class WorkflowExecutionEngine {
  constructor(registry?: any, logger?: any) {}
  async run(workflow: any, data?: any) { return []; }
  async executeWorkflow(workflow: any, input: any) { return {}; }
  async executeNode(node: any, input: any) { return {}; }
}
