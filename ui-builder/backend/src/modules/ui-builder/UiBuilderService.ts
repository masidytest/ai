import { UiApp, UiAppStore } from "./UiAppModel";
import { ComponentSchemaRegistry } from "./ComponentSchemaRegistry";

const registry = new ComponentSchemaRegistry();

export const UiBuilderService = {
  createApp(name: string): UiApp {
    const id = Math.random().toString(36).slice(2);
    return UiAppStore.create({ id, name, components: [], layout: {}, });
  },
  getApp(id: string): UiApp | undefined {
    return UiAppStore.get(id);
  },
  updateApp(id: string, data: Partial<Omit<UiApp, 'id' | 'createdAt' | 'updatedAt'>>): UiApp | undefined {
    return UiAppStore.update(id, data);
  },
  deleteApp(id: string): boolean {
    return UiAppStore.delete(id);
  },
  publishApp(id: string): UiApp | undefined {
    const app = UiAppStore.get(id);
    if (!app) return undefined;
    // For now, just set a published flag in layout
    return UiAppStore.update(id, { layout: { ...app.layout, published: true } });
  },
  validateAppStructure(app: UiApp): string[] {
    const errors: string[] = [];
    for (const comp of app.components) {
      const schema = registry.getSchema(comp.type);
      if (!schema) {
        errors.push(`Unknown component type: ${comp.type}`);
        continue;
      }
      // Validate required props
      for (const key of Object.keys(schema.props)) {
        if (schema.props[key]?.required && comp.props[key] == null) {
          errors.push(`Component ${comp.type} missing required prop: ${key}`);
        }
      }
      // Validate allowed children
      if (schema.allowedChildren && comp.children) {
        for (const childId of comp.children) {
          const child = app.components.find(c => c.id === childId);
          if (child && !schema.allowedChildren.includes(child.type)) {
            errors.push(`Component ${comp.type} cannot have child of type ${child.type}`);
          }
        }
      }
    }
    return errors;
  }
};
