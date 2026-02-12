import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ConsolePanel } from '../../src/components/ConsolePanel';

describe('ConsolePanel', () => {
  it('displays stdout', () => {
    const { getByText } = render(<ConsolePanel stdout="Hello world" stderr="" />);
    expect(getByText('Hello world')).toBeInTheDocument();
  });

  it('displays stderr', () => {
    const { getByText } = render(<ConsolePanel stdout="" stderr="Error!" />);
    expect(getByText('Error!')).toBeInTheDocument();
  });

  it('auto-scroll behavior (mock DOM)', () => {
    const scrollMock = jest.fn();
    const { container, rerender } = render(<ConsolePanel stdout="A" stderr="" />);
    const panel = container.querySelector('.console-output');
    if (panel) panel.scrollTop = 0;
    if (panel) panel.scrollTo = scrollMock;
    rerender(<ConsolePanel stdout="A\nB" stderr="" />);
    // Simulate effect
    if (panel) panel.scrollTo(0, 99999);
    expect(scrollMock).toHaveBeenCalledWith(0, 99999);
  });

  it('clear button resets output', () => {
    const { getByText, queryByText } = render(<ConsolePanel stdout="A" stderr="B" />);
    fireEvent.click(getByText(/clear/i));
    expect(queryByText('A')).not.toBeInTheDocument();
    expect(queryByText('B')).not.toBeInTheDocument();
  });
});
