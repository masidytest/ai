import { WorkflowRunLogger } from 'src/modules/workflow/WorkflowRunLogger';

describe('WorkflowRunLogger', () => {
  let logger: WorkflowRunLogger;

  beforeEach(() => {
    logger = new WorkflowRunLogger();
  });

  it('should log a run', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    logger.log('runId', 'nodeId', 'result');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('runId'));
    logSpy.mockRestore();
  });
});
