// src/modules/workflow/ConnectionGenerator.ts
// Utility for generating workflow connections between nodes

export type WorkflowConnection = {
  id: string;
  fromNode: string;
  fromPort: string;
  toNode: string;
  toPort: string;
};

export class ConnectionGenerator {
  /**
   * Connect nodes sequentially (node[i] -> node[i+1])
   */
  static connectSequential(nodes: { id: string }[]): WorkflowConnection[] {
    const connections: WorkflowConnection[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      connections.push({
        id: `conn_${nodes[i].id}_${nodes[i + 1].id}`,
        fromNode: nodes[i].id,
        fromPort: "out",
        toNode: nodes[i + 1].id,
        toPort: "in",
      });
    }
    return connections;
  }

  /**
   * Connect nodes with conditions (e.g., action -> condition -> action)
   */
  static connectConditional(nodes: { id: string; type: string }[], conditions: { id: string }[]): WorkflowConnection[] {
    const connections: WorkflowConnection[] = [];
    // Find first action, first condition, next action
    const firstAction = nodes.find(n => n.type === "action");
    const condition = conditions[0];
    const nextAction = nodes.filter(n => n.type === "action")[1];
    if (firstAction && condition && nextAction) {
      connections.push({
        id: `conn_${firstAction.id}_${condition.id}`,
        fromNode: firstAction.id,
        fromPort: "out",
        toNode: condition.id,
        toPort: "in",
      });
      connections.push({
        id: `conn_${condition.id}_${nextAction.id}`,
        fromNode: condition.id,
        fromPort: "true",
        toNode: nextAction.id,
        toPort: "in",
      });
    }
    return connections;
  }

  /**
   * Connect all nodes in parallel to a single trigger
   */
  static connectParallel(nodes: { id: string }[]): WorkflowConnection[] {
    if (nodes.length === 0) return [];
    const trigger = nodes[0];
    return nodes.slice(1).map(n => ({
      id: `conn_${trigger.id}_${n.id}`,
      fromNode: trigger.id,
      fromPort: "out",
      toNode: n.id,
      toPort: "in",
    }));
  }
}
