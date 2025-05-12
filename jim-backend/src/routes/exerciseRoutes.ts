import { Router } from 'express';
import { ExerciseController } from '../controllers/exerciseController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateExercise } from '../middleware/validateInput';

const router = Router();

router.get('/', generalRateLimiter, ExerciseController.getExercises);
router.get('/:id', generalRateLimiter, ExerciseController.getExercise);
router.post('/', authenticateToken, generalRateLimiter, validateExercise, ExerciseController.createExercise);
router.put('/:id', authenticateToken, generalRateLimiter, validateExercise, ExerciseController.updateExercise);
router.delete('/:id', authenticateToken, generalRateLimiter, ExerciseController.deleteExercise);
router.get('/categories', generalRateLimiter, ExerciseController.getCategories);
router.get('/muscle-groups', generalRateLimiter, ExerciseController.getMuscleGroups);

export default router;