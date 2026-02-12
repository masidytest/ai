import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MonacoEditorTabs } from '../../src/components/MonacoEditorTabs';

jest.mock('@monaco-editor/react', () => () => <div data-testid="monaco-editor" />);

describe('MonacoEditorTabs', () => {
  const tabs = [
    { id: '1', label: 'file1.ts', language: 'typescript', value: 'code1' },
    { id: '2', label: 'file2.js', language: 'javascript', value: 'code2' },
  ];
  it('renders tabs and editor', () => {
    const { getByText, getAllByTestId } = render(
      <MonacoEditorTabs
        tabs={tabs}
        activeTab={'1'}
        onTabChange={() => {}}
        onChange={() => {}}
      />
    );
    expect(getByText('file1.ts')).toBeInTheDocument();
    expect(getAllByTestId('monaco-editor').length).toBeGreaterThan(0);
  });
});
