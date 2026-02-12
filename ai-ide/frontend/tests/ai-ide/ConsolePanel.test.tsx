import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ConsolePanel } from '../../src/components/ConsolePanel';

describe('ConsolePanel', () => {
  it('renders stdout and stderr', () => {
    const { getByText } = render(<ConsolePanel stdout="out" stderr="err" onClear={() => {}} />);
    expect(getByText('out')).toBeInTheDocument();
    expect(getByText('err')).toBeInTheDocument();
  });
  it('calls onClear', () => {
    const onClear = jest.fn();
    const { getByText } = render(<ConsolePanel stdout="" onClear={onClear} />);
    fireEvent.click(getByText(/clear/i));
    expect(onClear).toHaveBeenCalled();
  });
});
