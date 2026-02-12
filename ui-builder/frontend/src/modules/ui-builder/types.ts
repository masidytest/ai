export interface UIComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: string[];
}

export interface AppModel {
  id: string;
  name: string;
  components: UIComponent[];
  layout: any;
  published?: boolean;
}

export interface ComponentSchema {
  type: string;
  displayName: string;
  props: Record<string, any>;
  icon?: string;
}
