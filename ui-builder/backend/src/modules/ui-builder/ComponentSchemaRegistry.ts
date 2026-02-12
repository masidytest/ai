export interface ComponentSchema {
  type: string;
  displayName: string;
  props: Record<string, any>;
  defaultProps?: Record<string, any>;
  allowedChildren?: string[];
  icon?: string; // placeholder for icon
}

export class ComponentSchemaRegistry {
  private schemas: Record<string, ComponentSchema> = {};

  registerComponent(type: string, schema: ComponentSchema) {
    this.schemas[type] = schema;
  }

  getSchema(type: string): ComponentSchema | undefined {
    return this.schemas[type];
  }

  listComponents(): ComponentSchema[] {
    return Object.values(this.schemas);
  }
}
