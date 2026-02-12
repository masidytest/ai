export const cronTrigger = {
  trigger: jest.fn().mockImplementation(async (schedule) => {
    return { event: 'cron', schedule };
  }),
};
