export class NodeRegistry {
  constructor() { this.registry = {}; }
  register(type: string, handler: any) { this.registry[type] = handler; }
  get(type: string) { return this.registry[type]; }
  getOrThrow(type: string) { if (!this.registry[type]) throw new Error('Not found'); return this.registry[type]; }
  private registry: Record<string, any>;
}
