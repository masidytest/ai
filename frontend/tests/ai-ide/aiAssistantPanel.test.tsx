import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock fetch globally
(global as any).fetch = jest.fn();

// Mock Monaco editor context
jest.mock('../../src/components/MonacoEditorTabs', () => ({
  useMonacoEditor: () => ({
    insertText: jest.fn(),
    getValue: () => '',
    setValue: jest.fn(),
  }),
}));

import { AiAssistantPanel } from '../../src/components/AiAssistantPanel';

describe('AiAssistantPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('sends prompt to backend (mock fetch)', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: async () => ({ done: true, value: null }) }) },
    });
    const { getByPlaceholderText, getByText } = render(<AiAssistantPanel />);
    fireEvent.change(getByPlaceholderText(/ask/i), { target: { value: 'test prompt' } });
    fireEvent.click(getByText(/send/i));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/ai-ide/generate'), expect.anything());
    });
  });

  it('displays streaming response (mock timers)', async () => {
    let resolveChunk;
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: {
        getReader: () => ({
          read: jest.fn()
            .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode('Hello') })
            .mockResolvedValueOnce({ done: true, value: null })
        })
      }
    });
    const { getByPlaceholderText, getByText, findByText } = render(<AiAssistantPanel />);
    fireEvent.change(getByPlaceholderText(/ask/i), { target: { value: 'stream' } });
    fireEvent.click(getByText(/send/i));
    await act(async () => {
      jest.runAllTimers();
    });
    expect(await findByText(/Hello/)).toBeInTheDocument();
  });

  it('inserts generated code into editor (mock editor)', async () => {
    const insertText = jest.fn();
    jest.spyOn(require('../../src/components/MonacoEditorTabs'), 'useMonacoEditor').mockReturnValue({
      insertText,
      getValue: () => '',
      setValue: jest.fn(),
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: async () => ({ done: true, value: null }) }) },
    });
    const { getByPlaceholderText, getByText } = render(<AiAssistantPanel />);
    fireEvent.change(getByPlaceholderText(/ask/i), { target: { value: 'insert code' } });
    fireEvent.click(getByText(/send/i));
    await waitFor(() => {
      expect(insertText).toHaveBeenCalled();
    });
  });

  it('handles errors gracefully', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });
    const { getByPlaceholderText, getByText, findByText } = render(<AiAssistantPanel />);
    fireEvent.change(getByPlaceholderText(/ask/i), { target: { value: 'fail' } });
    fireEvent.click(getByText(/send/i));
    expect(await findByText(/error/i)).toBeInTheDocument();
  });

  it('clears chat history', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      body: { getReader: () => ({ read: async () => ({ done: true, value: null }) }) },
    });
    const { getByText } = render(<AiAssistantPanel />);
    fireEvent.click(getByText(/clear/i));
    expect(getByText(/no messages/i)).toBeInTheDocument();
  });
});
