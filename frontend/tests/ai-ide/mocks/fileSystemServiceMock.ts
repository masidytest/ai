// Mock for FileSystemService
export const fileSystemService = {
  createProject: jest.fn().mockResolvedValue({ id: 'mocked-id', name: 'Mock Project', files: {} }),
  loadProject: jest.fn().mockResolvedValue({ id: 'mocked-id', name: 'Mock Project', files: {} }),
  saveFile: jest.fn().mockResolvedValue({ success: true }),
  readFile: jest.fn().mockResolvedValue(''),
  writeFile: jest.fn().mockResolvedValue(undefined),
  deleteFile: jest.fn().mockResolvedValue(undefined),
  listFiles: jest.fn().mockResolvedValue([]),
};
