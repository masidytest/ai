// src/modules/workflow/AiWorkflowGeneratorService.ts
// AI-powered workflow generation from natural language prompts

import { WorkflowDefinition, WorkflowNode, WorkflowConnection, WorkflowTrigger, WorkflowAction, WorkflowCondition, WorkflowParameter, WorkflowMetadata } from "../workflow/WorkflowEngineTypes";

export class AiWorkflowGeneratorService {
  /**
   * Generate a full workflow definition from a prompt
   */
  static generateWorkflow(prompt: string): WorkflowDefinition {
    const nodes = this.generateNodes(prompt);
    const connections = this.generateConnections(nodes);
    const triggers = [this.generateTrigger(prompt)];
    const conditions = this.generateConditions(prompt);
    const parameters: WorkflowParameter[] = nodes.flatMap(n => this.generateNodeParams(n.type, prompt));
    const metadata: WorkflowMetadata = {
      name: "AI Generated Workflow",
      description: `Generated from: ${prompt}`,
      createdBy: "ai-generator",
      createdAt: new Date().toISOString(),
    };
    return {
      nodes,
      connections,
      triggers,
      actions: nodes.filter(n => n.type === "action"),
      conditions,
      parameters,
      executionOrder: nodes.map(n => n.id),
      metadata,
    };
  }

  /**
   * Generate workflow nodes from a prompt
   */
  static generateNodes(prompt: string): WorkflowNode[] {
    // Rule-based: look for keywords
    const nodes: WorkflowNode[] = [];
    if (/email|notify/i.test(prompt)) {
      nodes.push({ id: "action1", type: "action", name: "Send Email", parameters: { to: "user.email", template: "welcome" } });
    }
    if (/crm|customer/i.test(prompt)) {
      nodes.push({ id: "action2", type: "action", name: "Add to CRM", parameters: { crm: "HubSpot" } });
    }
    if (/signup|register/i.test(prompt)) {
      nodes.push({ id: "trigger1", type: "trigger", name: "On Signup", parameters: { event: "user_signup" } });
    }
    if (/plan|upgrade/i.test(prompt)) {
      nodes.push({ id: "condition1", type: "condition", name: "Check Plan", parameters: { plan: "pro" } });
    }
    // Fallback
    if (nodes.length === 0) {
      nodes.push({ id: "trigger1", type: "trigger", name: "On Event", parameters: { event: "generic_event" } });
      nodes.push({ id: "action1", type: "action", name: "Log Event", parameters: { message: "Event occurred" } });
    }
    return nodes;
  }

  /**
   * Generate connections between nodes
   */
  static generateConnections(nodes: any[]): WorkflowConnection[] {
    // Pattern-based: connect trigger -> action -> condition -> action
    const connections: WorkflowConnection[] = [];
    const trigger = nodes.find(n => n.type === "trigger");
    const actions = nodes.filter(n => n.type === "action");
    const condition = nodes.find(n => n.type === "condition");
    if (trigger && actions.length) {
      connections.push({ from: trigger.id, to: actions[0].id });
      if (condition && actions[1]) {
        connections.push({ from: actions[0].id, to: condition.id });
        connections.push({ from: condition.id, to: actions[1].id, condition: true });
      }
    }
    return connections;
  }

  /**
   * Generate a trigger node from prompt
   */
  static generateTrigger(prompt: string): WorkflowTrigger {
    // Semantic: choose event type
    if (/signup|register/i.test(prompt)) {
      return { id: "trigger1", type: "event", event: "user_signup" };
    }
    if (/payment|purchase/i.test(prompt)) {
      return { id: "trigger1", type: "event", event: "payment_success" };
    }
    return { id: "trigger1", type: "event", event: "generic_event" };
  }

  /**
   * Generate node parameters based on type and prompt
   */
  static generateNodeParams(nodeType: string, prompt: string): WorkflowParameter[] {
    // Rule-based: map node type to params
    if (nodeType === "action" && /email/i.test(prompt)) {
      return [
        { name: "user.email", type: "string" },
        { name: "template", type: "string" },
      ];
    }
    if (nodeType === "condition" && /plan/i.test(prompt)) {
      return [
        { name: "plan", type: "string" },
      ];
    }
    return [];
  }

  /**
   * Generate workflow conditions from prompt
   */
  static generateConditions(prompt: string): WorkflowCondition[] {
    // Pattern-based: look for plan/upgrade
    if (/plan|upgrade/i.test(prompt)) {
      return [{ id: "condition1", type: "plan_check", params: { plan: "pro" } }];
    }
    return [];
  }
}
