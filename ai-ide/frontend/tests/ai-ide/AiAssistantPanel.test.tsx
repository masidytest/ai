import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { AiAssistantPanel } from '../../src/components/AiAssistantPanel';

describe('AiAssistantPanel', () => {
  it('renders input and buttons', () => {
    const { getByPlaceholderText, getByText } = render(<AiAssistantPanel />);
    expect(getByPlaceholderText(/ask ai/i)).toBeInTheDocument();
    expect(getByText(/generate/i)).toBeInTheDocument();
    expect(getByText(/refactor/i)).toBeInTheDocument();
    expect(getByText(/explain/i)).toBeInTheDocument();
  });

  it('calls onInsertCode when Insert is clicked', async () => {
    const onInsertCode = jest.fn();
    const { getByText } = render(<AiAssistantPanel onInsertCode={onInsertCode} />);
    fireEvent.click(getByText(/generate/i));
    await waitFor(() => expect(getByText(/insert/i)).toBeInTheDocument());
    fireEvent.click(getByText(/insert/i));
    expect(onInsertCode).toHaveBeenCalled();
  });
});
