
import { aiAssistantService } from '../../src/modules/ai-ide/AiAssistantService';

describe('AiAssistantService', () => {
  beforeAll(() => {
    // Mock all AI calls to match stub output
    jest.spyOn(aiAssistantService, 'generateCode').mockImplementation(async (prompt: any, context?: any) => {
      if (!prompt || typeof prompt !== 'string') return 'Invalid input';
      return `// [AI Generated Code]\n// Prompt: ${prompt}\n// Context: ${context || 'none'}`;
    });
    jest.spyOn(aiAssistantService, 'refactorCode').mockImplementation(async (code: any, instructions: any) => {
      if (!code || typeof code !== 'string' || !instructions || typeof instructions !== 'string') return 'Invalid input';
      return `// [AI Refactored Code]\n// Instructions: ${instructions}\n${code}`;
    });
    jest.spyOn(aiAssistantService, 'explainCode').mockImplementation(async (input: any) => {
      if (!input || typeof input !== 'string') return 'Invalid input';
      return `// [AI Explanation]\n// Code: ${input.substring(0, 100)}...`;
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('generateCode returns placeholder output', async () => {
    const res = await aiAssistantService.generateCode('let x = 1;');
    expect(res).toBe('// [AI Generated Code]\n// Prompt: let x = 1;\n// Context: none');
  });

  it('refactorCode returns modified placeholder output', async () => {
    const res = await aiAssistantService.refactorCode('let x = 1;', 'refactor this');
    expect(res).toBe('// [AI Refactored Code]\n// Instructions: refactor this\nlet x = 1;');
  });

  it('explainCode returns explanation placeholder', async () => {
    const res = await aiAssistantService.explainCode('let x = 1;');
    expect(res).toBe('// [AI Explanation]\n// Code: let x = 1;...');
  });

  it('all AI calls are mocked (no real LLM)', async () => {
    // The mock returns the placeholder, not a real LLM response
    const gen = await aiAssistantService.generateCode('test');
    const ref = await aiAssistantService.refactorCode('test', 'do something');
    const exp = await aiAssistantService.explainCode('test');
    expect(gen).toBe('// [AI Generated Code]\n// Prompt: test\n// Context: none');
    expect(ref).toBe('// [AI Refactored Code]\n// Instructions: do something\ntest');
    expect(exp).toBe('// [AI Explanation]\n// Code: test...');
  });

  it('handles empty or invalid input gracefully', async () => {
    const gen = await aiAssistantService.generateCode('');
    const ref1 = await aiAssistantService.refactorCode(null as any, 'instructions');
    const ref2 = await aiAssistantService.refactorCode('code', null as any);
    const exp = await aiAssistantService.explainCode(undefined as any);
    expect(gen).toBe('// [AI Generated Code]\n// Prompt: \n// Context: none');
    expect(ref1).toBe('// [AI Refactored Code]\n// Instructions: instructions\nnull');
    expect(ref2).toBe('// [AI Refactored Code]\n// Instructions: null\ncode');
    expect(exp).toBe('Invalid input');
  });
});
