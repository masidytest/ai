export const webhookTrigger = {
  trigger: jest.fn().mockImplementation(async (data) => {
    return { event: 'webhook', data };
  }),
};
