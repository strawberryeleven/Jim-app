import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

export class JWTService {
  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '24h',
    });
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });
  }

  static verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
  }

  static verifyRefreshToken(token: string): JWTPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JWTPayload;
  }
}