import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock backend services and network
jest.mock('../../src/services/FileSystemService', () => ({
  createProject: jest.fn().mockResolvedValue({ id: 'p1', name: 'Demo', files: { 'main.ts': { content: 'let x = 1;' } } }),
  loadProject: jest.fn().mockResolvedValue({ id: 'p1', name: 'Demo', files: { 'main.ts': { content: 'let x = 1;' } } }),
  saveFile: jest.fn().mockResolvedValue({ success: true }),
}));
jest.mock('../../src/services/ExecutionEngine', () => ({
  runCode: jest.fn().mockResolvedValue({ stdout: 'output', stderr: '', exitCode: 0 }),
}));
jest.mock('../../src/services/AiAssistantService', () => ({
  refactorCode: jest.fn().mockResolvedValue('// [AI Refactored Code]\nlet x = 2;'),
}));

// Mock fetch
(global as any).fetch = jest.fn((url, opts) => {
  if (url.includes('/ai-ide/project')) {
    return Promise.resolve({ ok: true, json: async () => ({ id: 'p1', name: 'Demo', files: { 'main.ts': { content: 'let x = 1;' } } }) });
  }
  if (url.includes('/ai-ide/run')) {
    return Promise.resolve({ ok: true, json: async () => ({ stdout: 'output', stderr: '', exitCode: 0 }) });
  }
  if (url.includes('/ai-ide/refactor')) {
    return Promise.resolve({ ok: true, json: async () => ({ result: '// [AI Refactored Code]\nlet x = 2;' }) });
  }
  return Promise.resolve({ ok: true, json: async () => ({}) });
});

// Mock Monaco editor
jest.mock('../../src/components/MonacoEditor', () => ({
  MonacoEditor: ({ value, onChange }) => (
    <textarea data-testid="monaco-textarea" value={value} onChange={e => onChange && onChange(e.target.value)} />
  ),
}));

import { IdeLayout } from '../../src/components/IdeLayout';

describe('Full IDE Flow', () => {
  it('simulates a full IDE workflow', async () => {
    let utils;
    await act(async () => {
      utils = render(<IdeLayout />);
    });
    // Create project
    fireEvent.click(utils.getByText(/new project/i));
    await waitFor(() => expect(utils.getByText('main.ts')).toBeInTheDocument());
    // Open file
    fireEvent.click(utils.getByText('main.ts'));
    expect(utils.getByTestId('monaco-textarea')).toHaveValue('let x = 1;');
    // Edit file
    act(() => {
      fireEvent.change(utils.getByTestId('monaco-textarea'), { target: { value: 'let x = 2;' } });
    });
    // Ask AI to refactor code
    fireEvent.change(utils.getByPlaceholderText(/ask/i), { target: { value: 'refactor' } });
    fireEvent.click(utils.getByText(/send/i));
    await waitFor(() => expect(utils.getByText(/AI Refactored Code/)).toBeInTheDocument());
    // Insert AI output into editor
    fireEvent.click(utils.getByText(/insert into editor/i));
    expect(utils.getByTestId('monaco-textarea')).toHaveValue('// [AI Refactored Code]\nlet x = 2;');
    // Run code
    fireEvent.click(utils.getByText(/run/i));
    await waitFor(() => expect(utils.getByText('output')).toBeInTheDocument());
  });
});
