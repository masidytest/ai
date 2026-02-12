export interface UiApp {
  id: string;
  name: string;
  components: any[];
  layout: any;
  createdAt: Date;
  updatedAt: Date;
}

const apps: Record<string, UiApp> = {};

export const UiAppStore = {
  create(app: Omit<UiApp, 'createdAt' | 'updatedAt'>): UiApp {
    const now = new Date();
    const newApp: UiApp = { ...app, createdAt: now, updatedAt: now };
    apps[newApp.id] = newApp;
    return newApp;
  },
  get(id: string): UiApp | undefined {
    return apps[id];
  },
  update(id: string, data: Partial<Omit<UiApp, 'id' | 'createdAt' | 'updatedAt'>>): UiApp | undefined {
    const app = apps[id];
    if (!app) return undefined;
    const updated: UiApp = { ...app, ...data, updatedAt: new Date() };
    apps[id] = updated;
    return updated;
  },
  delete(id: string): boolean {
    return delete apps[id];
  },
  list(): UiApp[] {
    return Object.values(apps);
  }
};
