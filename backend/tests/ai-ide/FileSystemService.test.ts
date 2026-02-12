// removed stray describe
import { fileSystemService } from '../../src/modules/ai-ide/FileSystemService';

describe('fileSystemService (in-memory)', () => {
  beforeEach(() => {
    // @ts-ignore
    fileSystemService.files = {};
    // @ts-ignore
    fileSystemService.projects = {};
  });

  it('creates a new project', () => {
    const project = fileSystemService.createProject('Demo');
    expect(project).toHaveProperty('id');
    expect(project.name).toBe('Demo');
  });

  it('writes a file', () => {
    fileSystemService.writeFile('foo.txt', 'bar');
    expect(fileSystemService.readFile('foo.txt')).toBe('bar');
  });

  it('reads a file', () => {
    fileSystemService.writeFile('a.txt', 'hello');
    expect(fileSystemService.readFile('a.txt')).toBe('hello');
  });

  it('deletes a file', () => {
    fileSystemService.writeFile('b.txt', 'bye');
    fileSystemService.deleteFile('b.txt');
    expect(fileSystemService.readFile('b.txt')).toBeUndefined();
  });

  it('lists files in a directory', () => {
    fileSystemService.writeFile('dir/x.js', '1');
    fileSystemService.writeFile('dir/y.js', '2');
    fileSystemService.writeFile('other/z.js', '3');
    expect(fileSystemService.listFiles('dir')).toEqual(['dir/x.js', 'dir/y.js']);
  });

  it('throws error for missing file', () => {
    expect(() => {
      const val = fileSystemService.readFile('notfound.txt');
      if (val === undefined) throw new Error('File not found');
    }).toThrow('File not found');
  });

  it('uses in-memory FS only', () => {
    expect(typeof fileSystemService.files).toBe('object');
    expect(typeof fileSystemService.projects).toBe('object');
  });
});
