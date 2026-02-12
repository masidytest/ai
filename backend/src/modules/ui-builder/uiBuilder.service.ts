import { apps, App } from './app.model';
import { v4 as uuidv4 } from 'uuid';
import Ajv from 'ajv';

const ajv = new Ajv();
const componentSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: { type: 'string' },
    props: { type: 'object' },
  },
  required: ['id', 'type', 'props'],
  additionalProperties: true,
};

export class UiBuilderService {
  static listApps(): App[] {
    return apps;
  }

  static createApp(data: { name: string; components: any[]; layout: any }): App {
    // Validate components
    for (const component of data.components) {
      const valid = ajv.validate(componentSchema, component);
      if (!valid) throw new Error('Invalid component schema');
    }
    const app: App = {
      id: uuidv4(),
      name: data.name,
      components: data.components,
      layout: data.layout,
    };
    apps.push(app);
    return app;
  }

  static publishApp(id: string): any {
    // Placeholder for publish logic
    const app = apps.find(a => a.id === id);
    if (!app) throw new Error('App not found');
    // Simulate publish
    return { status: 'published', appId: id };
  }
}
