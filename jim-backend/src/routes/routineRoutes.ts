import { Router } from 'express';
import { RoutineController } from '../controllers/routineController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateRoutine } from '../middleware/validateInput';

const router = Router();

router.get('/', generalRateLimiter, RoutineController.getRoutines);
router.get('/:id', generalRateLimiter, RoutineController.getRoutine);
router.post('/', authenticateToken, generalRateLimiter, validateRoutine, RoutineController.createRoutine);
router.put('/:id', authenticateToken, generalRateLimiter, validateRoutine, RoutineController.updateRoutine);
router.delete('/:id', authenticateToken, generalRateLimiter, RoutineController.deleteRoutine);
router.post('/:id/like', authenticateToken, generalRateLimiter, RoutineController.likeRoutine);
router.delete('/:id/like', authenticateToken, generalRateLimiter, RoutineController.unlikeRoutine);
router.get('/user/:userId', generalRateLimiter, RoutineController.getUserRoutines);

export default router;