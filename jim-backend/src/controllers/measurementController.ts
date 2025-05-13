import { Request, Response } from 'express';
import Measurement from '../models/measurementModel';
import { ErrorResponse } from '../types';

export class MeasurementController {
  static async getMeasurements(req: Request, res: Response) {
    try {
      const measurements = await Measurement.find({ userId: (req as any).user.userId })
        .sort({ date: -1 })
        .lean();

      res.json({
        success: true,
        measurements,
      });
    } catch (error) {
      throw error;
    }
  }

  static async addMeasurement(req: Request, res: Response) {
    try {
      const measurement = await Measurement.create({
        userId: (req as any).user.userId,
        ...req.body,
      });

      res.json({
        success: true,
        measurement,
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateMeasurement(req: Request, res: Response) {
    try {
      const measurement = await Measurement.findOneAndUpdate(
        { _id: req.params.id, userId: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      ).lean();

      if (!measurement) {
        const response: ErrorResponse = {
          success: false,
          error: 'Measurement not found',
          code: 'MEASUREMENT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      res.json({
        success: true,
        measurement,
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteMeasurement(req: Request, res: Response) {
    try {
      const measurement = await Measurement.findOneAndDelete({
        _id: req.params.id,
        userId: (req as any).user.userId,
      });

      if (!measurement) {
        const response: ErrorResponse = {
          success: false,
          error: 'Measurement not found',
          code: 'MEASUREMENT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      res.json({
        success: true,
        message: 'Measurement deleted successfully',
      });
    } catch (error) {
      throw error;
    }
  }
} 