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