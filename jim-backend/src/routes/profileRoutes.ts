import { Router } from 'express';
import { ProfileController } from '../controllers/profileController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateProfile } from '../middleware/validateInput';

const router = Router();

router.get('/', authenticateToken, generalRateLimiter, ProfileController.getProfile);
router.put('/', authenticateToken, generalRateLimiter, validateProfile, ProfileController.updateProfile);

export default router; 