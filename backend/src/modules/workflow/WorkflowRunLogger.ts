export class WorkflowRunLogger {
  private prisma: any;
  constructor(prisma?: any) { this.prisma = prisma; }

  logStart(runId: string) {
    this.prisma?.workflowLog.create({ data: { runId, event: 'start' } });
  }
  logEnd(runId: string) {
    this.prisma?.workflowLog.create({ data: { runId, event: 'end' } });
  }
  logNodeStart(runId: string, nodeId: string) {
    this.prisma?.workflowLog.create({ data: { runId, nodeId, event: 'nodeStart' } });
  }
  logNodeEnd(runId: string, nodeId: string) {
    this.prisma?.workflowLog.create({ data: { runId, nodeId, event: 'nodeEnd' } });
  }
  logError(runId: string, nodeId: string, error: Error) {
    this.prisma?.workflowLog.create({ data: { runId, nodeId, event: 'error', message: error.message } });
  }
  log(runId: string, nodeId?: string, result?: any) {
    this.prisma?.workflowLog.create({ data: { runId, nodeId, event: 'log', result } });
  }
  async getLogs(runId: string) {
    return this.prisma?.workflowLog.findMany({ where: { runId } }) ?? [];
  }
}
