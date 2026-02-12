// tests/integrations/mockExternalApi.ts

export const mockExternalApi = {
  fetchData: jest.fn(),
  sendData: jest.fn(),
};

// Helper to set up success response
export function mockApiSuccess() {
  mockExternalApi.fetchData.mockResolvedValue({ data: 'success' });
  mockExternalApi.sendData.mockResolvedValue({ status: 'ok' });
}

// Helper to set up failure response
export function mockApiFailure() {
  mockExternalApi.fetchData.mockRejectedValue(new Error('API error'));
  mockExternalApi.sendData.mockRejectedValue(new Error('API error'));
}

// Usage: inject mockExternalApi into your service constructor or as a dependency
