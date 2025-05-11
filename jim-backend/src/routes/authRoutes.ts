import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { validateRegister, validateLogin } from '../middleware/validateInput';
import { loginRateLimiter, registerRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post(
  '/register',
  registerRateLimiter,
  validateRegister,
  AuthController.register
);
router.post('/login', loginRateLimiter, validateLogin, AuthController.login);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/verify', authenticateToken, AuthController.verify);

export default router;