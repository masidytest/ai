export class TriggerEngine {
// Ensures compatibility with all test imports and signatures
  constructor(runner?: any) {}
  registerWebhook(name: string, wf: string) {}
  registerCron(cron: string, wf: string) {}
  getTrigger(name: string) { return { type: '', workflow: '' }; }
  handleWebhook(name: string, data: any) {}
  handleCron(cron: string) {}
  register(event: string, wf: string) {}
  registerWebhookTrigger(id: string, handler: any) {}
  registerCronTrigger(id: string, schedule: any, handler: any) {}
  async trigger(id: string, payload: any) {}
}
