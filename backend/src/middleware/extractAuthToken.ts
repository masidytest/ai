import { Request, Response, NextFunction } from 'express';

export function extractAuthToken(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.token = authHeader.split(' ')[1];
  } else {
    req.token = null;
  }
  next();
}

declare global {
  namespace Express {
    interface Request {
      token?: string | null;
    }
  }
}
