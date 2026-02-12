export class WorkflowService {
  constructor(validator?: any, engine?: any, trigger?: any, logger?: any) {}
  create(wf: any) {}
  update(id: string, wf: any) {}
  delete(id: string) {}
  async start(id: string, data: any) { return 'ok'; }
  async createWorkflow(data: any) { return {}; }
  async updateWorkflow(id: any, data: any) { return {}; }
  async deleteWorkflow(id: any) { return {}; }
  async runWorkflow(id: any, input: any) { return {}; }
}
