// src/modules/workflow/NodeGenerator.ts
// Utility for generating workflow nodes from parsed prompt data

export type WorkflowNode = {
  id: string;
  type: string;
  config: Record<string, any>;
  position: { x: number; y: number };
};

export class NodeGenerator {
  /**
   * Create a trigger node from an intent string
   */
  static createTriggerNode(intent: string): WorkflowNode {
    return {
      id: `trigger_${intent}`,
      type: "trigger",
      config: { event: intent },
      position: { x: 100, y: 100 },
    };
  }

  /**
   * Create action nodes from a list of action types
   */
  static createActionNodes(actions: string[]): WorkflowNode[] {
    return actions.map((action, i) => ({
      id: `action_${action}_${i}`,
      type: "action",
      config: { actionType: action },
      position: { x: 300, y: 100 + i * 120 },
    }));
  }

  /**
   * Create condition nodes from a list of condition types
   */
  static createConditionNodes(conditions: string[]): WorkflowNode[] {
    return conditions.map((cond, i) => ({
      id: `condition_${cond}_${i}`,
      type: "condition",
      config: { conditionType: cond },
      position: { x: 500, y: 100 + i * 120 },
    }));
  }

  /**
   * Create utility/data source nodes from a list of data sources
   */
  static createUtilityNodes(dataSources: string[]): WorkflowNode[] {
    return dataSources.map((src, i) => ({
      id: `utility_${src}_${i}`,
      type: "utility",
      config: { source: src },
      position: { x: 700, y: 100 + i * 120 },
    }));
  }
}
