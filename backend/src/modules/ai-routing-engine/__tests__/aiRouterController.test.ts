import { AiRouterController } from '../aiRouter.controller';
import { Request, Response } from 'express';

describe('AiRouterController', () => {
  it('should return 400 for missing prompt', () => {
    const req = { body: {} } as Request;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any as Response;
    AiRouterController.route(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid prompt' });
  });
});
