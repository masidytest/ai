import { AiRoutingService } from '../aiRoutingService';

describe('AiRoutingService', () => {
  it('should classify cloud intent', () => {
    const service = new AiRoutingService();
    const result = service.routePrompt('Deploy a new cloud server in EU with 4GB');
    expect(result.intent).toBe('cloud');
    expect(result.redirect).toBe('/dashboard/cloud');
    expect(result.metadata.serverSize).toBe('4GB');
    expect(result.metadata.region).toBe('EU');
  });
});
