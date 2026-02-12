import { users, User } from '../user/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret';
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

export class AuthService {
  static async signup(email: string, password: string): Promise<User> {
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user: User = {
      id: uuidv4(),
      email,
      passwordHash,
      createdAt: new Date(),
    };
    users.push(user);
    return user;
  }

  static async login(email: string, password: string): Promise<User> {
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');
    return user;
  }

  static generateTokens(user: User) {
    const accessToken = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
    return { accessToken, refreshToken };
  }

  static verifyAccessToken(token: string) {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  }
  static getUserById(userId: string) {
    return users.find(u => u.id === userId) || null;
  }
}
