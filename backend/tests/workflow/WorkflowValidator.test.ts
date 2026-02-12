import { WorkflowValidator } from 'src/modules/workflow/WorkflowValidator';

describe('WorkflowValidator', () => {
  let validator: WorkflowValidator;

  beforeEach(() => {
    validator = new WorkflowValidator();
  });

  it('should validate correct workflow', () => {
    const workflow = [{ id: 'A', input: {} }];
    expect(validator.validate(workflow)).toBe(true);
  });

  it('should invalidate incorrect workflow', () => {
    const workflow = [{ input: {} }];
    expect(validator.validate(workflow)).toBe(false);
  });
});
