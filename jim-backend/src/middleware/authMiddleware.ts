import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwtService';
import { ErrorResponse } from '../types';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const response: ErrorResponse = {
      success: false,
      error: 'No token provided',
      code: 'AUTH003',
    };
    return res.status(401).json(response);
  }

  try {
    const payload = JWTService.verifyAccessToken(token);
    (req as any).user = payload;
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid or expired token',
      code: 'AUTH004',
    };
    res.status(401).json(response);
  }
};