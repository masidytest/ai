// ComponentTreeGenerator: builds a valid UI Builder component tree from flat components and layout
import { v4 as uuidv4 } from 'uuid';

export class ComponentTreeGenerator {
  // Assign unique IDs to all components
  static assignIds(components: any[]): any[] {
    return components.map(comp => ({ ...comp, id: comp.id || uuidv4() }));
  }

  // Assign default props if missing
  static assignDefaultProps(components: any[], schema: any): any[] {
    return components.map(comp => {
      const compSchema = schema[comp.type] || {};
      const defaultProps = {};
      if (compSchema.props) {
        for (const key in compSchema.props) {
          if (comp.props[key] === undefined && compSchema.props[key].default !== undefined) {
            defaultProps[key] = compSchema.props[key].default;
          }
        }
      }
      return { ...comp, props: { ...defaultProps, ...comp.props } };
    });
  }

  // Build a tree from flat components and layout (simple: nest by grid position)
  static buildTree(components: any[], layout: any): any {
    // For now, just return a root App with all as children
    return {
      id: uuidv4(),
      type: 'App',
      props: {},
      children: components.map(c => ({ ...c, children: c.children || [] }))
    };
  }

  // Nest components based on intent (stub: group Cards inside Main, etc.)
  static nestComponentsBasedOnIntent(components: any[], intent: string): any[] {
    if (intent === 'dashboard') {
      const main = components.find(c => c.type === 'Main');
      if (main) {
        main.children = components.filter(c => c.type === 'Card' || c.type === 'Table');
        return components.filter(c => c.type !== 'Card' && c.type !== 'Table');
      }
    }
    return components;
  }

  // Validate tree against schema (stub: check required props)
  static validateAgainstSchema(tree: any, schema: any): boolean {
    if (!tree || !tree.type) return false;
    const compSchema = schema[tree.type];
    if (compSchema && compSchema.props) {
      for (const key in compSchema.props) {
        if (compSchema.props[key].required && tree.props[key] === undefined) {
          return false;
        }
      }
    }
    if (tree.children && Array.isArray(tree.children)) {
      return tree.children.every(child => this.validateAgainstSchema(child, schema));
    }
    return true;
  }
}
