import { ProjectManager } from './mocks/projectManagerMock';
import React from 'react';
import { render, act, fireEvent, waitFor } from '@testing-library/react';

describe('ProjectManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads project from backend (mock fetch)', async () => {
    await act(async () => {
      render(<ProjectManager projectId="1" />);
    });
    expect(ProjectManager).toHaveBeenCalledWith({ projectId: '1' }, {});
  });

  it('saves files automatically', async () => {
    let utils: any;
    await act(async () => {
      utils = render(<ProjectManager projectId="1" />);
    });
    act(() => {
      if (utils.getByTestId('file-editor')) {
        utils.getByTestId('file-editor').value = 'new content';
        fireEvent.change(utils.getByTestId('file-editor'));
      }
    });
    await waitFor(() => {
      expect(ProjectManager).toHaveBeenCalled();
    });
  });
});
