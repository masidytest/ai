import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock MonacoEditor component
jest.mock('../../src/components/MonacoEditor', () => ({
  MonacoEditor: ({ value, onChange, onSave, theme }) => (
    <div data-testid="monaco-editor" data-theme={theme}>
      <textarea
        data-testid="monaco-textarea"
        value={value}
        onChange={e => onChange && onChange(e.target.value)}
      />
      <button data-testid="save-btn" onClick={() => onSave && onSave(value)}>Save</button>
    </div>
  ),
}));

import { MonacoEditorTabs } from '../../src/components/MonacoEditorTabs';

describe('MonacoEditorTabs', () => {
  it('Editor initializes with given content', () => {
    const { getByTestId } = render(
      <MonacoEditorTabs files={{ 'a.ts': 'hello' }} openTabs={['a.ts']} activeTab="a.ts" />
    );
    expect(getByTestId('monaco-textarea')).toHaveValue('hello');
  });

  it('onChange event fires correctly', () => {
    const handleChange = jest.fn();
    const { getByTestId } = render(
      <MonacoEditorTabs files={{ 'a.ts': 'hi' }} openTabs={['a.ts']} activeTab="a.ts" onChange={handleChange} />
    );
    act(() => {
      fireEvent.change(getByTestId('monaco-textarea'), { target: { value: 'changed' } });
    });
    expect(handleChange).toHaveBeenCalledWith('a.ts', 'changed');
  });

  it('onSave triggers callback', () => {
    const handleSave = jest.fn();
    const { getByTestId } = render(
      <MonacoEditorTabs files={{ 'a.ts': 'save me' }} openTabs={['a.ts']} activeTab="a.ts" onSave={handleSave} />
    );
    act(() => {
      fireEvent.click(getByTestId('save-btn'));
    });
    expect(handleSave).toHaveBeenCalledWith('a.ts');
  });

  it('Tab switching updates editor content', () => {
    const { getByTestId, rerender } = render(
      <MonacoEditorTabs files={{ 'a.ts': 'A', 'b.ts': 'B' }} openTabs={['a.ts', 'b.ts']} activeTab="a.ts" />
    );
    expect(getByTestId('monaco-textarea')).toHaveValue('A');
    rerender(
      <MonacoEditorTabs files={{ 'a.ts': 'A', 'b.ts': 'B' }} openTabs={['a.ts', 'b.ts']} activeTab="b.ts" />
    );
    expect(getByTestId('monaco-textarea')).toHaveValue('B');
  });

  it('Editor theme is applied (mocked)', () => {
    const { getByTestId } = render(
      <MonacoEditorTabs files={{ 'a.ts': '' }} openTabs={['a.ts']} activeTab="a.ts" theme="vs-dark" />
    );
    expect(getByTestId('monaco-editor')).toHaveAttribute('data-theme', 'vs-dark');
  });
});
