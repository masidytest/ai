import { ExampleService } from 'src/services/exampleService';

describe('ExampleService', () => {
  let service: ExampleService;
  let mockDependency: any;

  beforeEach(() => {
    mockDependency = {
      doSomething: jest.fn(),
    };
    service = new ExampleService(mockDependency);
  });

  it('should return result on success', async () => {
    mockDependency.doSomething.mockResolvedValue('success!');
    const result = await service.performTask('input');
    expect(result).toBe('success!');
    expect(mockDependency.doSomething).toHaveBeenCalledWith('input');
  });

  it('should throw error on failure', async () => {
    mockDependency.doSomething.mockRejectedValue(new Error('fail'));
    await expect(service.performTask('input')).rejects.toThrow('fail');
  });
});
