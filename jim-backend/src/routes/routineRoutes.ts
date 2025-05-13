import { Router } from 'express';
import { RoutineController } from '../controllers/routineController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateRoutine } from '../middleware/validateInput';

const router = Router();

// Public routes
router.get('/', generalRateLimiter, RoutineController.getRoutines);
router.get('/:id', generalRateLimiter, RoutineController.getRoutine);

// Protected routes
router.get('/user/:userId', authenticateToken, generalRateLimiter, RoutineController.getUserRoutines);
router.post('/', authenticateToken, generalRateLimiter, validateRoutine, RoutineController.createRoutine);
router.put('/:id', authenticateToken, generalRateLimiter, validateRoutine, RoutineController.updateRoutine);
router.delete('/:id', authenticateToken, generalRateLimiter, RoutineController.deleteRoutine);
router.post('/:id/like', authenticateToken, generalRateLimiter, RoutineController.likeRoutine);

export default router;