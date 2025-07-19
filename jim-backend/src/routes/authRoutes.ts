import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateLogin } from '../middleware/validateInput';

const router = Router();

router.post('/register', generalRateLimiter, AuthController.register);
router.post('/login', generalRateLimiter, validateLogin, AuthController.login);
router.post('/logout', generalRateLimiter, AuthController.logout);
router.post('/refresh-token', generalRateLimiter, AuthController.refreshToken);
router.get('/verify-email', generalRateLimiter, AuthController.verifyEmail);

export default router;