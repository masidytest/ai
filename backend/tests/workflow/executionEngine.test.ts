import { WorkflowExecutionEngine } from '../../src/modules/workflow/WorkflowExecutionEngine';

describe('WorkflowExecutionEngine', () => {
  let engine: WorkflowExecutionEngine;
  let mockRegistry: any;
  let mockLogger: any;

  beforeEach(() => {
    mockRegistry = { get: jest.fn() };
    mockLogger = { log: jest.fn(), error: jest.fn() };
    engine = new WorkflowExecutionEngine(mockRegistry, mockLogger);
  });

  it('executes a linear workflow (A → B → C)', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue('A') };
    const nodeB = { execute: jest.fn().mockResolvedValue('B') };
    const nodeC = { execute: jest.fn().mockResolvedValue('C') };
    mockRegistry.get.mockImplementation((id: string) => ({ A: nodeA, B: nodeB, C: nodeC }[id]));
    const workflow = [
      { id: 'A', input: {}, next: 'B' },
      { id: 'B', input: {}, next: 'C' },
      { id: 'C', input: {} },
    ];
    const result = await engine.run(workflow);
    expect(result).toEqual(['A', 'B', 'C']);
  });

  it('executes branching workflows (Condition → branch)', async () => {
    const conditionNode = { execute: jest.fn().mockImplementation(({ value }) => (value > 10 ? 'B' : 'C')) };
    const nodeB = { execute: jest.fn().mockResolvedValue('B') };
    const nodeC = { execute: jest.fn().mockResolvedValue('C') };
    mockRegistry.get.mockImplementation((id: string) => ({ cond: conditionNode, B: nodeB, C: nodeC }[id]));
    const workflow = [
      { id: 'cond', input: { value: 20 }, next: null },
      { id: 'B', input: {}, next: null },
      { id: 'C', input: {}, next: null },
    ];
    const result = await engine.run(workflow);
    expect(result).toContain('B');
    expect(result).not.toContain('C');
  });

  it('passes data between nodes correctly', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue({ foo: 1 }) };
    const nodeB = { execute: jest.fn().mockImplementation((input) => input.foo + 1) };
    mockRegistry.get.mockImplementation((id: string) => (id === 'A' ? nodeA : nodeB));
    const workflow = [
      { id: 'A', input: {}, next: 'B' },
      { id: 'B', input: {}, next: null },
    ];
    const result = await engine.run(workflow);
    expect(result[1]).toBe(2);
  });

  it('handles async nodes', async () => {
    const asyncNode = { execute: jest.fn().mockResolvedValue('async') };
    mockRegistry.get.mockReturnValue(asyncNode);
    const workflow = [
      { id: 'async', input: {} },
    ];
    const result = await engine.run(workflow);
    expect(result).toEqual(['async']);
  });

  it('stops execution on error and logs it', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue('A') };
    const nodeB = { execute: jest.fn().mockRejectedValue(new Error('fail')) };
    mockRegistry.get.mockImplementation((id: string) => (id === 'A' ? nodeA : nodeB));
    const workflow = [
      { id: 'A', input: {}, next: 'B' },
      { id: 'B', input: {}, next: null },
    ];
    await expect(engine.run(workflow)).rejects.toThrow('fail');
    expect(mockLogger.error).toHaveBeenCalled();
  });

  it('supports workflows with multiple starting nodes', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue('A') };
    const nodeB = { execute: jest.fn().mockResolvedValue('B') };
    mockRegistry.get.mockImplementation((id: string) => (id === 'A' ? nodeA : nodeB));
    const workflow = [
      { id: 'A', input: {} },
      { id: 'B', input: {} },
    ];
    const result = await engine.run(workflow);
    expect(result).toEqual(['A', 'B']);
  });

  it('ensures circular loops are rejected unless explicitly allowed', async () => {
    const nodeA = { execute: jest.fn().mockResolvedValue('A') };
    mockRegistry.get.mockReturnValue(nodeA);
    const workflow = [
      { id: 'A', input: {}, next: 'A' },
    ];
    await expect(engine.run(workflow)).rejects.toThrow(/circular/i);
  });
});
