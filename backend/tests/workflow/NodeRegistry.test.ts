import { NodeRegistry } from 'src/modules/workflow/NodeRegistry';

describe('NodeRegistry', () => {
  let registry: NodeRegistry;

  beforeEach(() => {
    registry = new NodeRegistry();
  });

  it('registers node types correctly', () => {
    const nodeType = { id: 'email', category: 'Actions', meta: { label: 'Send Email' } };
    registry.register('email', nodeType);
    expect(registry.get('email')).toBe(nodeType);
  });

  it('retrieves metadata for a node type', () => {
    const nodeType = { id: 'trigger', category: 'Triggers', meta: { label: 'On Start' } };
    registry.register('trigger', nodeType);
    expect(registry.get('trigger')?.meta.label).toBe('On Start');
  });

  it('throws error for unknown node type', () => {
    expect(() => registry.getOrThrow('unknown')).toThrow();
  });

  it('allows dynamic registration of new node types', () => {
    const newNode = { id: 'custom', category: 'Logic', meta: { label: 'Custom Node' } };
    registry.register('custom', newNode);
    expect(registry.get('custom')).toBe(newNode);
  });

  it('ensures categories (Triggers, Actions, Logic) are handled properly', () => {
    const trigger = { id: 't', category: 'Triggers', meta: {} };
    const action = { id: 'a', category: 'Actions', meta: {} };
    const logic = { id: 'l', category: 'Logic', meta: {} };
    registry.register('t', trigger);
    registry.register('a', action);
    registry.register('l', logic);
    const all = [registry.get('t'), registry.get('a'), registry.get('l')];
    expect(all.map(n => n?.category)).toEqual(['Triggers', 'Actions', 'Logic']);
  });
});
