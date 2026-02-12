import { WorkflowRunLogger } from '../../src/modules/workflow/WorkflowRunLogger';

describe('WorkflowRunLogger', () => {
  let logger: WorkflowRunLogger;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      workflowLog: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };
    logger = new WorkflowRunLogger(mockPrisma);
  });

  it('logs workflow start', () => {
    logger.logStart('run1');
    expect(mockPrisma.workflowLog.create).toHaveBeenCalledWith(expect.objectContaining({ runId: 'run1', event: 'start' }));
  });

  it('logs workflow end', () => {
    logger.logEnd('run2');
    expect(mockPrisma.workflowLog.create).toHaveBeenCalledWith(expect.objectContaining({ runId: 'run2', event: 'end' }));
  });

  it('logs node execution start/end', () => {
    logger.logNodeStart('run3', 'nodeA');
    logger.logNodeEnd('run3', 'nodeA');
    expect(mockPrisma.workflowLog.create).toHaveBeenCalledWith(expect.objectContaining({ runId: 'run3', nodeId: 'nodeA', event: 'nodeStart' }));
    expect(mockPrisma.workflowLog.create).toHaveBeenCalledWith(expect.objectContaining({ runId: 'run3', nodeId: 'nodeA', event: 'nodeEnd' }));
  });

  it('logs errors', () => {
    logger.logError('run4', 'nodeB', new Error('fail'));
    expect(mockPrisma.workflowLog.create).toHaveBeenCalledWith(expect.objectContaining({ runId: 'run4', nodeId: 'nodeB', event: 'error', message: 'fail' }));
  });

  it('stores logs in database (mock Prisma)', () => {
    logger.logStart('run5');
    expect(mockPrisma.workflowLog.create).toHaveBeenCalled();
  });

  it('retrieves logs via service method', async () => {
    mockPrisma.workflowLog.findMany.mockResolvedValue([{ runId: 'run6', event: 'start' }]);
    const logs = await logger.getLogs('run6');
    expect(logs).toEqual([{ runId: 'run6', event: 'start' }]);
    expect(mockPrisma.workflowLog.findMany).toHaveBeenCalledWith({ where: { runId: 'run6' } });
  });
});
