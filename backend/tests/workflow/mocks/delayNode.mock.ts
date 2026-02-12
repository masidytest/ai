export const delayNode = {
  execute: jest.fn().mockImplementation(async ({ ms }) => {
    if (typeof ms === 'number') return 'done';
    throw new Error('Invalid delay');
  }),
};
