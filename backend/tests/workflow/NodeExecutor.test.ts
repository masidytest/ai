import { NodeExecutor } from '../../src/modules/workflow/NodeExecutor';

describe('NodeExecutor', () => {
  let executor: NodeExecutor;

  beforeEach(() => {
    executor = new NodeExecutor();
  });

  it('executes a simple Delay node', async () => {
    const delayNode = { execute: jest.fn().mockResolvedValue('done') };
    const result = await executor.execute(delayNode, { ms: 100 });
    expect(result).toBe('done');
    expect(delayNode.execute).toHaveBeenCalledWith({ ms: 100 });
  });

  it('passes input data to node logic', async () => {
    const node = { execute: jest.fn().mockResolvedValue('ok') };
    await executor.execute(node, { foo: 'bar' });
    expect(node.execute).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('returns output data correctly', async () => {
    const node = { execute: jest.fn().mockResolvedValue({ result: 42 }) };
    const result = await executor.execute(node, {});
    expect(result).toEqual({ result: 42 });
  });

  it('throws error when node type is unknown', async () => {
    await expect(executor.execute(undefined as any, {})).rejects.toThrow();
  });

  it('mocks HTTP Request node and tests success + failure', async () => {
    const httpNode = { execute: jest.fn() };
    httpNode.execute.mockResolvedValue({ status: 200, data: 'ok' });
    const success = await executor.execute(httpNode, { url: 'http://test' });
    expect(success).toEqual({ status: 200, data: 'ok' });
    httpNode.execute.mockRejectedValue(new Error('fail'));
    await expect(executor.execute(httpNode, { url: 'bad' })).rejects.toThrow('fail');
  });

  it('tests Condition node branching logic', async () => {
    const conditionNode = {
      execute: jest.fn().mockImplementation(({ value }) => (value > 10 ? 'branchA' : 'branchB')),
    };
    const resultA = await executor.execute(conditionNode, { value: 20 });
    const resultB = await executor.execute(conditionNode, { value: 5 });
    expect(resultA).toBe('branchA');
    expect(resultB).toBe('branchB');
  });
});
