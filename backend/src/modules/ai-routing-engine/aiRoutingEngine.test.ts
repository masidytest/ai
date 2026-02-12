import { AiRoutingService } from './aiRoutingService';

describe('AiRoutingService', () => {
  const service = new AiRoutingService();

  it('classifies cloud intent', () => {
    const result = service.routePrompt('Deploy a new cloud server in EU with 4GB');
    expect(result.intent).toBe('cloud');
    expect(result.redirect).toBe('/dashboard/cloud');
    expect(result.metadata.serverSize).toBe('4GB');
    expect(result.metadata.region).toBe('EU');
  });

  it('classifies hosting intent', () => {
    const result = service.routePrompt('Set up shared hosting for my site');
    expect(result.intent).toBe('hosting');
    expect(result.redirect).toBe('/dashboard/hosting');
  });

  it('classifies domains intent', () => {
    const result = service.routePrompt('Register domain example.com and update DNS');
    expect(result.intent).toBe('domains');
    expect(result.redirect).toBe('/dashboard/domains');
    expect(result.metadata.domain).toBe('example.com');
  });

  it('classifies workflows intent', () => {
    const result = service.routePrompt('Create a workflow with email trigger');
    expect(result.intent).toBe('workflows');
    expect(result.redirect).toBe('/dashboard/workflows');
    expect(result.metadata.workflowTrigger).toBe('email');
  });

  it('classifies builder intent', () => {
    const result = service.routePrompt('Add a table and chart to the dashboard UI');
    expect(result.intent).toBe('builder');
    expect(result.redirect).toBe('/dashboard/builder');
    expect(result.metadata.uiComponents).toContain('table');
    expect(result.metadata.uiComponents).toContain('chart');
  });

  it('classifies ai-ide intent', () => {
    const result = service.routePrompt('Refactor this code in the editor');
    expect(result.intent).toBe('ai-ide');
    expect(result.redirect).toBe('/dashboard/ai-ide');
  });

  it('classifies deploy intent', () => {
    const result = service.routePrompt('Deploy my app to production');
    expect(result.intent).toBe('deploy');
    expect(result.redirect).toBe('/dashboard/deploy');
  });

  it('classifies database intent', () => {
    const result = service.routePrompt('Create a new SQL table in the database');
    expect(result.intent).toBe('database');
    expect(result.redirect).toBe('/dashboard/database');
  });

  it('classifies billing intent', () => {
    const result = service.routePrompt('Show my invoices and payment history');
    expect(result.intent).toBe('billing');
    expect(result.redirect).toBe('/dashboard/billing');
  });

  it('classifies settings intent', () => {
    const result = service.routePrompt('Update my profile and API key');
    expect(result.intent).toBe('settings');
    expect(result.redirect).toBe('/dashboard/settings');
  });

  it('returns unknown for unrelated prompt', () => {
    const result = service.routePrompt('Tell me a joke about cats');
    expect(result.intent).toBe('unknown');
    expect(result.redirect).toBe('/dashboard');
  });
});
