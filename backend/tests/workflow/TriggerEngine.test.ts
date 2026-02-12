import { TriggerEngine } from 'src/modules/workflow/TriggerEngine';

describe('TriggerEngine', () => {
  let engine: TriggerEngine;
  let mockWorkflowRunner: any;

  beforeEach(() => {
    mockWorkflowRunner = { run: jest.fn() };
    engine = new TriggerEngine(mockWorkflowRunner);
  });

  it('registers webhook triggers', () => {
    engine.registerWebhook('myWebhook', 'wf1');
    expect(engine.getTrigger('myWebhook')).toEqual({ type: 'webhook', workflow: 'wf1' });
  });

  it('registers cron triggers', () => {
    engine.registerCron('0 0 * * *', 'wf2');
    expect(engine.getTrigger('0 0 * * *')).toEqual({ type: 'cron', workflow: 'wf2' });
  });

  it('executes workflow when webhook is called', () => {
    engine.registerWebhook('webhook', 'wf3');
    engine.handleWebhook('webhook', { foo: 'bar' });
    expect(mockWorkflowRunner.run).toHaveBeenCalledWith('wf3', { foo: 'bar' });
  });

  it('executes workflow on cron schedule (mock timers)', () => {
    jest.useFakeTimers();
    engine.registerCron('* * * * *', 'wf4');
    engine.handleCron('* * * * *');
    expect(mockWorkflowRunner.run).toHaveBeenCalledWith('wf4', undefined);
    jest.useRealTimers();
  });

  it('rejects invalid trigger definitions', () => {
    expect(() => engine.registerWebhook('', 'wf')).toThrow();
    expect(() => engine.registerCron('', 'wf')).toThrow();
  });

  it('ensures trigger → workflow mapping is correct', () => {
    engine.registerWebhook('t1', 'wfA');
    engine.registerCron('c1', 'wfB');
    expect(engine.getTrigger('t1').workflow).toBe('wfA');
    expect(engine.getTrigger('c1').workflow).toBe('wfB');
  });
});
