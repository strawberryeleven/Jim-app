import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 requests per hour
  message: {
    success: false,
    error: 'Too many login attempts, please try again later',
    code: 'AUTH007',
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit to 10 requests per hour
  message: {
    success: false,
    error: 'Too many registration attempts, please try again later',
    code: 'AUTH007',
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Limit to 1000 requests per hour
  message: {
    success: false,
    error: 'Too many requests, please try again later',
    code: 'RATE001',
  },
});