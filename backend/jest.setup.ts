// Extend Jest timeout to 20 seconds
jest.setTimeout(20000);

// Store original console methods
const originalError = console.error;
const originalWarn = console.warn;

// Mock console.error and console.warn to keep test output clean
beforeAll(() => {
	console.error = () => {};
	console.warn = () => {};
});

afterAll(() => {
	console.error = originalError;
	console.warn = originalWarn;
});

// Prepare global test utilities here if needed
// Jest setup file for global test hooks, mocks, etc.
// Example: jest.setTimeout(10000);
