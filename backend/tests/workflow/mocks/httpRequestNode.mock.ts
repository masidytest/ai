export const httpRequestNode = {
  execute: jest.fn().mockImplementation(async ({ url, method }) => {
    if (url && method) return { status: 200, data: 'ok' };
    throw new Error('Invalid request');
  }),
};
