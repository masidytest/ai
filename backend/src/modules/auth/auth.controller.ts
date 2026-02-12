import { Request, Response } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.signup(email, password);
      const tokens = AuthService.generateTokens(user);
      res.status(201).json({ user: { id: user.id, email: user.email, createdAt: user.createdAt }, ...tokens });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await AuthService.login(email, password);
      const tokens = AuthService.generateTokens(user);
      res.json({ user: { id: user.id, email: user.email, createdAt: user.createdAt }, ...tokens });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const payload = AuthService.verifyRefreshToken(refreshToken);
      const user = AuthService.getUserById(payload.userId);
      if (!user) throw new Error('User not found');
      const tokens = AuthService.generateTokens(user);
      res.json(tokens);
    } catch (err: any) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }
}
