import { Router } from 'express';
import { MeasurementController } from '../controllers/measurementController';
import { authenticateToken } from '../middleware/authMiddleware';
import { generalRateLimiter } from '../middleware/rateLimiter';
import { validateMeasurement } from '../middleware/validateInput';

const router = Router();

router.get('/', authenticateToken, generalRateLimiter, MeasurementController.getMeasurements);
router.post('/', authenticateToken, generalRateLimiter, validateMeasurement, MeasurementController.addMeasurement);
router.put('/:id', authenticateToken, generalRateLimiter, validateMeasurement, MeasurementController.updateMeasurement);
router.delete('/:id', authenticateToken, generalRateLimiter, MeasurementController.deleteMeasurement);

export default router; 