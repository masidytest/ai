import { WorkflowService } from 'src/modules/workflow/WorkflowService';

describe('WorkflowService', () => {
  let service: WorkflowService;
  let mockValidator: any;
  let mockEngine: any;
  let mockTrigger: any;
  let mockLogger: any;

  beforeEach(() => {
    mockValidator = { validate: jest.fn() };
    mockEngine = { run: jest.fn() };
    mockTrigger = { register: jest.fn() };
    mockLogger = { log: jest.fn() };
    service = new WorkflowService(mockValidator, mockEngine, mockTrigger, mockLogger);
  });

  it('creates a workflow with valid nodes + connections', () => {
    mockValidator.validate.mockReturnValue(true);
    const wf = { id: 'wf1', nodes: [{ id: 'A' }], connections: [] };
    expect(() => service.create(wf)).not.toThrow();
  });

  it('rejects invalid workflows (missing nodes, invalid connections)', () => {
    mockValidator.validate.mockReturnValue(false);
    const wf = { id: 'wf2', nodes: [], connections: [] };
    expect(() => service.create(wf)).toThrow();
  });

  it('updates workflow definitions', () => {
    mockValidator.validate.mockReturnValue(true);
    const wf = { id: 'wf3', nodes: [{ id: 'A' }], connections: [] };
    service.create(wf);
    const updated = { id: 'wf3', nodes: [{ id: 'A' }, { id: 'B' }], connections: [] };
    expect(() => service.update('wf3', updated)).not.toThrow();
  });

  it('deletes workflows', () => {
    mockValidator.validate.mockReturnValue(true);
    const wf = { id: 'wf4', nodes: [{ id: 'A' }], connections: [] };
    service.create(wf);
    expect(() => service.delete('wf4')).not.toThrow();
  });

  it('starts workflow execution (mock ExecutionEngine)', async () => {
    mockValidator.validate.mockReturnValue(true);
    mockEngine.run.mockResolvedValue('ok');
    const wf = { id: 'wf5', nodes: [{ id: 'A' }], connections: [] };
    service.create(wf);
    const result = await service.start('wf5', {});
    expect(result).toBe('ok');
    expect(mockEngine.run).toHaveBeenCalled();
  });

  it('registers triggers (mock TriggerEngine)', () => {
    mockValidator.validate.mockReturnValue(true);
    const wf = { id: 'wf6', nodes: [{ id: 'A' }], connections: [], triggers: [{ type: 'webhook', event: 'onCreate' }] };
    service.create(wf);
    expect(mockTrigger.register).toHaveBeenCalledWith('onCreate', 'wf6');
  });

  it('logs workflow runs (mock Logger)', async () => {
    mockValidator.validate.mockReturnValue(true);
    mockEngine.run.mockResolvedValue('ok');
    const wf = { id: 'wf7', nodes: [{ id: 'A' }], connections: [] };
    service.create(wf);
    await service.start('wf7', {});
    expect(mockLogger.log).toHaveBeenCalled();
  });
});
