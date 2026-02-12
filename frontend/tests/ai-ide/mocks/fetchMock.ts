// Mock for fetch API
global.fetch = jest.fn((url, opts) => {
  return Promise.resolve({
    ok: true,
    json: async () => ({}),
    text: async () => '',
    body: { getReader: () => ({ read: async () => ({ done: true, value: null }) }) },
    status: 200,
  });
});
