export const emailNode = {
  execute: jest.fn().mockImplementation(async ({ to, subject, body }) => {
    if (to && subject && body) return { status: 'sent' };
    throw new Error('Invalid email');
  }),
};
