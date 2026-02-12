import { projectManager } from '../../src/services/ProjectManager';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ProjectManager', () => {
  beforeEach(() => {
    projectManager.project = null;
    projectManager.openTabs = [];
    projectManager.activeTab = '';
  });

  it('loads a project from backend', async () => {
    mockedAxios.get.mockResolvedValue({ data: { id: '1', name: 'Test', files: {} } });
    const project = await projectManager.loadProject('1');
    expect(project?.id).toBe('1');
  });

  it('creates a project', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: '2', name: 'New', files: {} } });
    const project = await projectManager.createProject('New');
    expect(project?.id).toBe('2');
  });

  it('syncs open tabs', () => {
    projectManager.syncTabs([{ id: 'a', label: 'A', language: 'js', value: '' }]);
    expect(projectManager.openTabs.length).toBe(1);
  });
});
