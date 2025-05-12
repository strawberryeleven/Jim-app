import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit to 5 requests per minute
  message: {
    success: false,
    error: 'Too many login attempts, please try again later',
    code: 'AUTH007',
  },
});

export const registerRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // Limit to 3 requests per minute
  message: {
    success: false,
    error: 'Too many registration attempts, please try again later',
    code: 'AUTH007',
  },
});

export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});