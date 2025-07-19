import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  const response: ErrorResponse = {
    success: false,
    error: err.message || 'Internal server error',
    code: 'SERVER_ERROR',
  };
  res.status(500).json(response);
};