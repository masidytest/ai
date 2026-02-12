import { WorkflowValidator } from 'src/modules/workflow/WorkflowValidator';

describe('WorkflowValidator', () => {
  let validator: WorkflowValidator;

  beforeEach(() => {
    validator = new WorkflowValidator();
  });

  it('validates correct workflow structure', () => {
    const wf = { nodes: [{ id: 'A', type: 'action' }], connections: [{ from: 'A', to: 'B' }] };
    expect(validator.validate(wf)).toBe(true);
  });

  it('detects invalid node types', () => {
    const wf = { nodes: [{ id: 'A', type: 'unknown' }], connections: [] };
    expect(validator.validate(wf)).toBe(false);
  });

  it('detects invalid connections', () => {
    const wf = { nodes: [{ id: 'A', type: 'action' }], connections: [{ from: 'A', to: 'Z' }] };
    expect(validator.validate(wf)).toBe(false);
  });

  it('detects missing config fields', () => {
    const wf = { nodes: [{ id: 'A' }], connections: [] };
    expect(validator.validate(wf)).toBe(false);
  });

  it('detects circular dependencies', () => {
    const wf = { nodes: [{ id: 'A', type: 'action' }, { id: 'B', type: 'action' }], connections: [
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
    ] };
    expect(validator.validate(wf)).toBe(false);
  });

  it('accepts workflows with optional metadata', () => {
    const wf = { nodes: [{ id: 'A', type: 'action', meta: { label: 'Test' } }], connections: [] };
    expect(validator.validate(wf)).toBe(true);
  });
});
