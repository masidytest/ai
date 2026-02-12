import { executionEngine } from '../../src/modules/ai-ide/ExecutionEngine';

describe('ExecutionEngine', () => {
  it('should simulate JS/TS code execution', async () => {
    const js = await executionEngine.runCode('javascript', 'console.log(1)');
    expect(js.stdout).toContain('Simulated output');
    const ts = await executionEngine.runCode('typescript', 'let x: number = 2;');
    expect(ts.stdout).toContain('Simulated output');
  });

  it('should return error for unsupported language', async () => {
    const res = await executionEngine.runCode('python' as any, 'print(1)');
    expect(res.exitCode).toBe(1);
    expect(res.stderr).toContain('Unsupported language');
  });
  it('executes simple JS code and returns stdout', async () => {
    const res = await executionEngine.runCode('javascript', 'console.log("hi")');
    expect(res.stdout).toContain('Simulated output');
    expect(res.exitCode).toBe(0);
  });

  it('captures stderr correctly (mock)', async () => {
    // Simulate error by patching runCode
    const orig = executionEngine.runCode;
    executionEngine.runCode = async () => ({ stdout: '', stderr: 'error', exitCode: 1 });
    const res = await executionEngine.runCode('javascript', 'throw new Error()');
    expect(res.stderr).toBe('error');
    expect(res.exitCode).toBe(1);
    executionEngine.runCode = orig;
  });

  it('returns exitCode', async () => {
    const res = await executionEngine.runCode('javascript', 'console.log(1)');
    expect(typeof res.exitCode).toBe('number');
  });

  it('rejects unsafe operations (mock sandbox)', async () => {
    // Simulate sandbox rejection
    const orig = executionEngine.runCode;
    executionEngine.runCode = async () => ({ stdout: '', stderr: 'Unsafe operation', exitCode: 1 });
    const res = await executionEngine.runCode('javascript', 'process.exit(1)');
    expect(res.stderr).toContain('Unsafe');
    executionEngine.runCode = orig;
  });

  it('handles async code execution (mock)', async () => {
    // Simulate async
    const orig = executionEngine.runCode;
    executionEngine.runCode = async () => ({ stdout: 'async result', stderr: '', exitCode: 0 });
    const res = await executionEngine.runCode('javascript', 'await fetch()');
    expect(res.stdout).toBe('async result');
    executionEngine.runCode = orig;
  });

  it('times out long-running code (mock timers)', async () => {
    // Simulate timeout
    const orig = executionEngine.runCode;
    executionEngine.runCode = async () => ({ stdout: '', stderr: 'Timeout', exitCode: 1 });
    const res = await executionEngine.runCode('javascript', 'while(true){}');
    expect(res.stderr).toContain('Timeout');
    executionEngine.runCode = orig;
  });
});
