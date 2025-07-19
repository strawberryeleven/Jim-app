import { Router } from 'express';
import { WorkoutController } from '../controllers/workoutController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateWorkout } from '../middleware/validateInput';

const router = Router();

router.get('/', generalRateLimiter, WorkoutController.getWorkouts);
router.get('/:id', generalRateLimiter, WorkoutController.getWorkout);
router.post('/', authenticateToken, generalRateLimiter, validateWorkout, WorkoutController.createWorkout);
router.put('/:id', authenticateToken, generalRateLimiter, validateWorkout, WorkoutController.updateWorkout);
router.delete('/:id', authenticateToken, generalRateLimiter, WorkoutController.deleteWorkout);
router.post('/:id/like', authenticateToken, generalRateLimiter, WorkoutController.likeWorkout);
router.delete('/:id/like', authenticateToken, generalRateLimiter, WorkoutController.unlikeWorkout);
router.get('/user/:userId', authenticateToken, generalRateLimiter, WorkoutController.getUserWorkouts);

export default router;