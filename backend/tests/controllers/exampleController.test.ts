import request from 'supertest';
import express from 'express';
import { ExampleController } from 'src/controllers/exampleController';

// Mock the service layer
const mockService = {
  getData: jest.fn(),
  createData: jest.fn(),
};

// Set up Express app and controller
const app = express();
app.use(express.json());
const controller = new ExampleController(mockService);
app.get('/example', controller.getData.bind(controller));
app.post('/example', controller.createData.bind(controller));

describe('ExampleController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /example should return data', async () => {
    mockService.getData.mockResolvedValue({ message: 'ok' });
    const res = await request(app).get('/example');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'ok' });
    expect(mockService.getData).toHaveBeenCalled();
  });

  it('POST /example should create data', async () => {
    mockService.createData.mockResolvedValue({ id: 1, value: 'created' });
    const res = await request(app)
      .post('/example')
      .send({ value: 'created' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, value: 'created' });
    expect(mockService.createData).toHaveBeenCalledWith({ value: 'created' });
  });
});
