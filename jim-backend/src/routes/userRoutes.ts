import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateUpdateProfile, validateUpdateName, validateUpdateEmail, validateUpdatePassword } from '../middleware/validateInput';

const router = Router();

router.get('/profile', authenticateToken, generalRateLimiter, UserController.getProfile);
router.put('/profile', authenticateToken, generalRateLimiter, validateUpdateProfile, UserController.updateProfile);

// New routes for updating user information
router.put('/name', authenticateToken, generalRateLimiter, validateUpdateName, UserController.updateName);
router.put('/email', authenticateToken, generalRateLimiter, validateUpdateEmail, UserController.updateEmail);
router.put('/password', authenticateToken, generalRateLimiter, validateUpdatePassword, UserController.updatePassword);

router.get('/:id', generalRateLimiter, UserController.getUser);
router.post('/:id/follow', authenticateToken, generalRateLimiter, UserController.followUser);
router.delete('/:id/follow', authenticateToken, generalRateLimiter, UserController.unfollowUser);
router.get('/:id/followers', generalRateLimiter, UserController.getFollowers);
router.get('/:id/following', generalRateLimiter, UserController.getFollowing);

export default router;