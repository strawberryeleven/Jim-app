import express from 'express';
import { WorkoutLogController } from '../controllers/workoutLogController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateWorkoutLog } from '../middleware/validateInput';

const router = express.Router();

// Protected routes
router.use(authenticateToken);

// Get all workout logs (with pagination and public filter)
router.get('/', generalRateLimiter, WorkoutLogController.getWorkoutLogs);

// Create a new workout log
router.post('/', generalRateLimiter, validateWorkoutLog, WorkoutLogController.createWorkoutLog);

// Update a workout log
router.put('/:id', generalRateLimiter, validateWorkoutLog, WorkoutLogController.updateWorkoutLog);

// Delete a workout log
router.delete('/:id', generalRateLimiter, WorkoutLogController.deleteWorkoutLog);

export default router;