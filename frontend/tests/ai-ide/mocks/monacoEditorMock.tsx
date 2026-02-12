import React from 'react';
// Mock for Monaco Editor
export const MonacoEditor = ({ value, onChange, onSave, theme }: any) => (
  <div data-testid="monaco-editor" data-theme={theme}>
    <textarea
      data-testid="monaco-textarea"
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
    />
    <button data-testid="save-btn" onClick={() => onSave && onSave(value)}>Save</button>
  </div>
);
export const useMonacoEditor = () => ({
  insertText: jest.fn(),
  getValue: jest.fn(() => ''),
  setValue: jest.fn(),
});
