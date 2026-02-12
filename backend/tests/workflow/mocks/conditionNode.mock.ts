export const conditionNode = {
  execute: jest.fn().mockImplementation(async ({ value }) => {
    return value > 10 ? 'branchA' : 'branchB';
  }),
};
