import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorResponse } from '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: (error as Error).message,
      code: 'AUTH001',
    };
    res.status(400).json(response);
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: (error as Error).message,
      code: 'AUTH001',
    };
    res.status(400).json(response);
  }
};