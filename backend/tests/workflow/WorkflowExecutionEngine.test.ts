import { WorkflowExecutionEngine } from 'src/modules/workflow/WorkflowExecutionEngine';

describe('WorkflowExecutionEngine', () => {
  let engine: WorkflowExecutionEngine;
  let mockRegistry: any;
  let mockLogger: any;

  beforeEach(() => {
    mockRegistry = { get: jest.fn() };
    mockLogger = { log: jest.fn() };
    engine = new WorkflowExecutionEngine(mockRegistry, mockLogger);
  });

  it('should execute workflow nodes in order', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue('A') };
    const nodeB = { execute: jest.fn().mockResolvedValue('B') };
    mockRegistry.get.mockImplementation((id: string) => (id === 'A' ? nodeA : nodeB));
    const workflow = [{ id: 'A', input: {} }, { id: 'B', input: {} }];
    const result = await engine.run(workflow);
    expect(result).toEqual(['A', 'B']);
    expect(nodeA.execute).toHaveBeenCalled();
    expect(nodeB.execute).toHaveBeenCalled();
  });

  it('should log execution', async () => {
    const node = { execute: jest.fn().mockResolvedValue('X') };
    mockRegistry.get.mockReturnValue(node);
    const workflow = [{ id: 'X', input: {} }];
    await engine.run(workflow);
    expect(mockLogger.log).toHaveBeenCalled();
  });
});
