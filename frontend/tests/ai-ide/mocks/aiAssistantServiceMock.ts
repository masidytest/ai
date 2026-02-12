// Mock for AiAssistantService
export const aiAssistantService = {
  generateCode: jest.fn().mockResolvedValue('mocked generated code'),
  refactorCode: jest.fn().mockResolvedValue('mocked refactored code'),
  explainCode: jest.fn().mockResolvedValue('mocked explanation'),
};
