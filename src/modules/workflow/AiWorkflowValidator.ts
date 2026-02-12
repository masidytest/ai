// src/modules/workflow/AiWorkflowValidator.ts
// Utility for validating AI-generated workflow structures

export class AiWorkflowValidator {
  /**
   * Validate nodes array
   */
  static validateNodes(nodes: any[]): string[] {
    const warnings: string[] = [];
    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      warnings.push("No nodes defined in workflow.");
    }
    const ids = new Set();
    nodes.forEach(n => {
      if (!n.id) warnings.push("Node missing id.");
      if (ids.has(n.id)) warnings.push(`Duplicate node id: ${n.id}`);
      ids.add(n.id);
      if (!n.type) warnings.push(`Node ${n.id} missing type.`);
      if (!n.config) warnings.push(`Node ${n.id} missing config.`);
    });
    return warnings;
  }

  /**
   * Validate connections array
   */
  static validateConnections(conns: any[]): string[] {
    const warnings: string[] = [];
    if (!conns || !Array.isArray(conns)) {
      warnings.push("Connections must be an array.");
      return warnings;
    }
    conns.forEach(c => {
      if (!c.fromNode || !c.toNode) warnings.push("Connection missing fromNode or toNode.");
      if (!c.fromPort || !c.toPort) warnings.push(`Connection ${c.id} missing port info.`);
    });
    return warnings;
  }

  /**
   * Validate trigger object
   */
  static validateTrigger(trigger: any): string[] {
    const warnings: string[] = [];
    if (!trigger) {
      warnings.push("No trigger defined.");
      return warnings;
    }
    if (!trigger.type) warnings.push("Trigger missing type.");
    if (!trigger.config) warnings.push("Trigger missing config.");
    return warnings;
  }

  /**
   * Validate parameters array
   */
  static validateParams(params: any[]): string[] {
    const warnings: string[] = [];
    if (!params || !Array.isArray(params)) {
      warnings.push("Parameters must be an array.");
      return warnings;
    }
    params.forEach(p => {
      if (!p.name) warnings.push("Parameter missing name.");
      if (!p.type) warnings.push(`Parameter ${p.name || "unknown"} missing type.`);
    });
    return warnings;
  }

  /**
   * Validate execution order array
   */
  static validateExecutionOrder(order: any[], nodes: any[]): string[] {
    const warnings: string[] = [];
    if (!order || !Array.isArray(order)) {
      warnings.push("Execution order must be an array.");
      return warnings;
    }
    const nodeIds = new Set(nodes.map(n => n.id));
    order.forEach(id => {
      if (!nodeIds.has(id)) warnings.push(`Execution order references missing node: ${id}`);
    });
    return warnings;
  }
}
