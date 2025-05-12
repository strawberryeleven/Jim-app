import { Router } from 'express';
import { WorkoutLogController } from '../controllers/workoutLogController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateWorkoutLog } from '../middleware/validateInput';

const router = Router();

router.get('/', authenticateToken, generalRateLimiter, WorkoutLogController.getWorkoutLogs);
router.get('/stats', authenticateToken, generalRateLimiter, WorkoutLogController.getStats);
router.get('/user/:userId', authenticateToken, generalRateLimiter, WorkoutLogController.getUserWorkoutLogs);
router.get('/:id', authenticateToken, generalRateLimiter, WorkoutLogController.getWorkoutLog);
router.post('/', authenticateToken, generalRateLimiter, validateWorkoutLog, WorkoutLogController.createWorkoutLog);
router.put('/:id', authenticateToken, generalRateLimiter, validateWorkoutLog, WorkoutLogController.updateWorkoutLog);
router.delete('/:id', authenticateToken, generalRateLimiter, WorkoutLogController.deleteWorkoutLog);

export default router;