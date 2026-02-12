import { WorkflowExecutionEngine } from '../../src/modules/workflow/WorkflowExecutionEngine';
import { TriggerEngine } from '../../src/modules/workflow/TriggerEngine';
import { WorkflowRunLogger } from '../../src/modules/workflow/WorkflowRunLogger';

describe('Full Workflow Integration', () => {
  let engine: WorkflowExecutionEngine;
  let trigger: TriggerEngine;
  let logger: WorkflowRunLogger;
  let mockRegistry: any;
  let mockLogger: any;

  beforeEach(() => {
    mockRegistry = { get: jest.fn() };
    mockLogger = { log: jest.fn(), error: jest.fn() };
    logger = new WorkflowRunLogger({
      workflowLog: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    });
    engine = new WorkflowExecutionEngine(mockRegistry, mockLogger);
    trigger = new TriggerEngine({ run: jest.fn((wf, data) => engine.run(wf, data)) });
  });

  it('simulates a full workflow with branching', async () => {
    // Mock node logic
    const nodeA = { execute: jest.fn().mockResolvedValue({ a: 1 }) };
    const nodeB = { execute: jest.fn().mockResolvedValue({ b: 2 }) };
    const conditionNode = {
      execute: jest.fn().mockImplementation((input) => (input.a > 0 ? 'C' : 'D')),
    };
    const nodeC = { execute: jest.fn().mockResolvedValue({ c: 3 }) };
    const nodeD = { execute: jest.fn().mockResolvedValue({ d: 4 }) };
    mockRegistry.get.mockImplementation((id: string) => {
      switch (id) {
        case 'A': return nodeA;
        case 'B': return nodeB;
        case 'COND': return conditionNode;
        case 'C': return nodeC;
        case 'D': return nodeD;
        default: return undefined;
      }
    });

    // Define workflow
    const workflow = [
      { id: 'A', input: {}, next: 'B' },
      { id: 'B', input: {}, next: 'COND' },
      { id: 'COND', input: {}, next: null },
      { id: 'C', input: {}, next: null },
      { id: 'D', input: {}, next: null },
    ];

    // Simulate trigger
    await trigger.handleWebhook('start', {});
    const result = await engine.run(workflow, {});

    // Assert execution order
    expect(nodeA.execute).toHaveBeenCalled();
    expect(nodeB.execute).toHaveBeenCalled();
    expect(conditionNode.execute).toHaveBeenCalled();
    // Only one branch should execute
    expect(nodeC.execute.mock.calls.length + nodeD.execute.mock.calls.length).toBe(1);

    // Assert data flow
    expect(nodeA.execute).toHaveBeenCalledWith({});
    expect(nodeB.execute).toHaveBeenCalledWith({ a: 1 });
    expect(conditionNode.execute).toHaveBeenCalledWith({ b: 2 });

    // Assert logs (mockLogger)
    expect(mockLogger.log).toHaveBeenCalled();

    // Assert correct branch execution
    if (nodeC.execute.mock.calls.length) {
      expect(result).toContainEqual({ c: 3 });
    } else {
      expect(result).toContainEqual({ d: 4 });
    }
  });
});
