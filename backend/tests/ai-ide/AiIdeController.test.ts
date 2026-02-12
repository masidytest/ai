
import request from 'supertest';
import express from 'express';
import { AiIdeController } from '../../src/modules/ai-ide/AiIdeController';
import * as aiAssistantServiceModule from '../../src/modules/ai-ide/AiAssistantService';
import * as executionEngineModule from '../../src/modules/ai-ide/ExecutionEngine';
import * as fileSystemServiceModule from '../../src/modules/ai-ide/FileSystemService';

const app = express();
app.use(express.json());
app.use('/ai-ide', AiIdeController);

describe('AiIdeController routes', () => {
  beforeAll(() => {
    jest.spyOn(aiAssistantServiceModule.aiAssistantService, 'generateCode').mockImplementation(async () => 'mocked-generate');
    jest.spyOn(aiAssistantServiceModule.aiAssistantService, 'refactorCode').mockImplementation(async () => 'mocked-refactor');
    jest.spyOn(aiAssistantServiceModule.aiAssistantService, 'explainCode').mockImplementation(async () => 'mocked-explain');
    jest.spyOn(executionEngineModule.executionEngine, 'runCode').mockImplementation(async () => ({ stdout: 'mocked-run', stderr: '', exitCode: 0 }));
    jest.spyOn(fileSystemServiceModule.fileSystemService, 'loadProject').mockImplementation((id: string) => ({ id, name: 'Mock Project', files: {} }));
    jest.spyOn(fileSystemServiceModule.fileSystemService, 'createProject').mockImplementation((name: string) => ({ id: 'mocked-id', name, files: {} }));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('POST /ai-ide/generate returns AI output', async () => {
    const res = await request(app)
      .post('/ai-ide/generate')
      .send({ prompt: 'test' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(`// [AI Generated Code]\n// Prompt: test\n// Context: none`);
  });

  it('POST /ai-ide/refactor returns AI output', async () => {
    const res = await request(app)
      .post('/ai-ide/refactor')
      .send({ code: 'code', instructions: 'do this' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(`// [AI Refactored Code]\n// Instructions: do this\ncode`);
  });

  it('POST /ai-ide/explain returns AI output', async () => {
    const res = await request(app)
      .post('/ai-ide/explain')
      .send({ code: 'code' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBe(`// [AI Explanation]\n// Code: code...`);
  });

  it('POST /ai-ide/run returns execution output', async () => {
    const res = await request(app)
      .post('/ai-ide/run')
      .send({ language: 'javascript', code: 'console.log(1)' });
    expect(res.status).toBe(200);
    expect(res.body.stdout).toBe('Simulated output for javascript:\nconsole.log(1)');
    expect(res.body.exitCode).toBe(0);
  });

  it('GET /ai-ide/project/:id loads project structure', async () => {
    // No project will exist, expect 404
    const res = await request(app)
      .get('/ai-ide/project/123');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Project not found');
  });

  it('POST /ai-ide/project creates a new project', async () => {
    const res = await request(app)
      .post('/ai-ide/project')
      .send({ name: 'My Project' });
    expect(res.status).toBe(200);
    expect(res.body.id).toMatch(/^project-/);
    expect(res.body.name).toBe('My Project');
    expect(res.body.files).toBeDefined();
  });
});
// ...existing code...
// ...existing code...
