// AiUiValidator.ts
// Validates AI-generated UI trees for type, props, layout, and hierarchy issues

import { getSchema } from "./ComponentSchemaRegistry";

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

export class AiUiValidator {
  static validateComponentTypes(tree: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    function walk(node: any) {
      const schema = getSchema(node.type);
      if (!schema) {
        errors.push(`Unknown component type: ${node.type}`);
      }
      (node.children || []).forEach(walk);
    }
    walk(tree);
    return { errors, warnings };
  }

  static validateProps(tree: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    function walk(node: any) {
      const schema = getSchema(node.type);
      if (schema) {
        const required = schema.requiredProps || [];
        required.forEach((prop: string) => {
          if (!(node.props && node.props.hasOwnProperty(prop))) {
            errors.push(`Missing required prop '${prop}' on ${node.type}`);
          }
        });
        if (node.props) {
          Object.keys(node.props).forEach(key => {
            if (!schema.props || !schema.props[key]) {
              warnings.push(`Unknown prop '${key}' on ${node.type}`);
            }
          });
        }
      }
      (node.children || []).forEach(walk);
    }
    walk(tree);
    return { errors, warnings };
  }

  static validateLayout(tree: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    function walk(node: any) {
      const { x, y, w, h } = node.props || {};
      if (typeof x !== "number" || typeof y !== "number") {
        errors.push(`Component ${node.type} (${node.id}) missing x/y position.`);
      }
      if (typeof w !== "number" || typeof h !== "number") {
        warnings.push(`Component ${node.type} (${node.id}) missing width/height.`);
      }
      (node.children || []).forEach(walk);
    }
    walk(tree);
    return { errors, warnings };
  }

  static validateHierarchy(tree: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    function walk(node: any, parentType?: string) {
      const schema = getSchema(node.type);
      if (schema && schema.parentTypes && parentType && !schema.parentTypes.includes(parentType)) {
        errors.push(`Component ${node.type} cannot be nested inside ${parentType}`);
      }
      (node.children || []).forEach((child: any) => walk(child, node.type));
    }
    walk(tree);
    return { errors, warnings };
  }
}
