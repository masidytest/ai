export interface App {
  id: string;
  name: string;
  components: any[];
  layout: any;
}

// In-memory placeholder
export const apps: App[] = [];
