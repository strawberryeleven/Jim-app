import { Request, Response } from 'express';
import WorkoutLog from '../models/workoutLogModel';
import { ErrorResponse, WorkoutLogResponse } from '../types';
import { mapWorkoutLogToResponse } from '../utils/mappers';

export class WorkoutLogController {
  static async getWorkoutLogs(req: Request, res: Response) {
    try {
      const logs = await WorkoutLog.find({ user: (req as any).user.userId })
        .populate('user', 'name email')
        .populate('workout', 'name description')
        .populate('exercises.exercise', 'name description')
        .lean();
      const response: WorkoutLogResponse = {
        success: true,
        logs: logs.map(mapWorkoutLogToResponse),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getWorkoutLog(req: Request, res: Response) {
    try {
      const log = await WorkoutLog.findOne({
        _id: req.params.id,
        user: (req as any).user.userId,
      })
        .populate('user', 'name email')
        .populate('workout', 'name description')
        .populate('exercises.exercise', 'name description')
        .lean();
      if (!log) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout log not found',
          code: 'WORKOUT_LOG_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: WorkoutLogResponse = {
        success: true,
        log: mapWorkoutLogToResponse(log),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async createWorkoutLog(req: Request, res: Response) {
    try {
      const log = new WorkoutLog({
        ...req.body,
        user: (req as any).user.userId,
      });
      await log.save();

      const populatedLog = await WorkoutLog.findById(log._id)
        .populate('user', 'name email')
        .populate('workout', 'name description')
        .populate('exercises.exercise', 'name description')
        .lean();

      const response: WorkoutLogResponse = {
        success: true,
        log: mapWorkoutLogToResponse(populatedLog!),
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateWorkoutLog(req: Request, res: Response) {
    try {
      const log = await WorkoutLog.findOneAndUpdate(
        { _id: req.params.id, user: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      )
        .populate('user', 'name email')
        .populate('workout', 'name description')
        .populate('exercises.exercise', 'name description')
        .lean();
      if (!log) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout log not found or unauthorized',
          code: 'WORKOUT_LOG_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: WorkoutLogResponse = {
        success: true,
        log: mapWorkoutLogToResponse(log),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteWorkoutLog(req: Request, res: Response) {
    try {
      const log = await WorkoutLog.findOneAndDelete({
        _id: req.params.id,
        user: (req as any).user.userId,
      });
      if (!log) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout log not found or unauthorized',
          code: 'WORKOUT_LOG_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: WorkoutLogResponse = {
        success: true,
        message: 'Workout log deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const logs = await WorkoutLog.find({ user: (req as any).user.userId }).lean();
      if (!logs.length) {
        const response: WorkoutLogResponse = {
          success: true,
          stats: {
            totalWorkouts: 0,
            totalDuration: 0,
            exercisesCompleted: 0,
          },
        };
        return res.json(response);
      }

      const stats = logs.reduce(
        (acc, log) => {
          const exercisesCompleted = log.exercises.reduce(
            (sum, ex) => sum + ex.sets.filter(set => set.completed).length,
            0
          );
          return {
            totalWorkouts: acc.totalWorkouts + 1,
            totalDuration: acc.totalDuration + log.duration,
            exercisesCompleted: acc.exercisesCompleted + exercisesCompleted,
          };
        },
        { totalWorkouts: 0, totalDuration: 0, exercisesCompleted: 0 }
      );

      const response: WorkoutLogResponse = {
        success: true,
        stats,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getUserWorkoutLogs(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const logs = await WorkoutLog.find({ user: userId })
        .populate('user', 'name email')
        .populate('workout', 'name description')
        .populate('exercises.exercise', 'name description')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean();

      const total = await WorkoutLog.countDocuments({ user: userId });

      const response: WorkoutLogResponse = {
        success: true,
        logs: logs.map(mapWorkoutLogToResponse),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}
