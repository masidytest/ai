// Mock for ExecutionEngine
export const executionEngine = {
  runCode: jest.fn().mockResolvedValue({ stdout: 'mocked output', stderr: '', exitCode: 0 }),
};
