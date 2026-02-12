import { Request, Response, NextFunction } from 'express';

// Example: Basic request validation middleware
export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) { 
      return res.status(400).json({ error: error.details?.[0]?.message || 'Invalid request' });
    }
    next();
  };
}
