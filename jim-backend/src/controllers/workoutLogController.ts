import { Request, Response } from 'express';
import WorkoutLog from '../models/workoutLogModel';
import { ErrorResponse, WorkoutLogResponse } from '../types';
import { mapWorkoutLogToResponse } from '../utils/mappers';

export class WorkoutLogController {
  static async getWorkoutLogs(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, isPublic } = req.query;
      const query: any = {};

      // If requesting public logs, show all public logs
      // Otherwise, show only user's logs
      if (isPublic === 'true') {
        query.isPublic = true;
      } else {
        query.userId = (req as any).user.userId;
      }

      const workoutLogs = await WorkoutLog.find(query)
        .sort({ date: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .lean();

      const total = await WorkoutLog.countDocuments(query);

      res.json({
        success: true,
        workoutLogs,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit))
        }
      });
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
      const workoutLog = await WorkoutLog.create({
        userId: (req as any).user.userId,
        ...req.body
      });

      res.status(201).json({
        success: true,
        workoutLog
      });
    } catch (error) {
      throw error;
    }
  }

  static async updateWorkoutLog(req: Request, res: Response) {
    try {
      const workoutLog = await WorkoutLog.findOneAndUpdate(
        { _id: req.params.id, userId: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      ).lean();

      if (!workoutLog) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout log not found',
          code: 'WORKOUT_LOG_NOT_FOUND'
        };
        return res.status(404).json(response);
      }

      res.json({
        success: true,
        workoutLog
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteWorkoutLog(req: Request, res: Response) {
    try {
      const workoutLog = await WorkoutLog.findOneAndDelete({
        _id: req.params.id,
        userId: (req as any).user.userId
      });

      if (!workoutLog) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout log not found',
          code: 'WORKOUT_LOG_NOT_FOUND'
        };
        return res.status(404).json(response);
      }

      res.json({
        success: true,
        message: 'Workout log deleted successfully'
      });
    } catch (error) {
      throw error;
    }
  }

  static async getStats(req: Request, res: Response) {
    try {
      const logs = await WorkoutLog.find({ userId: (req as any).user.userId }).lean();
      if (!logs.length) {
        const response: WorkoutLogResponse = {
          success: true,
          stats: {
            totalWorkouts: 0,
            totalDuration: 0,
            totalVolume: 0,
            totalSets: 0,
            muscleGroups: {}
          },
        };
        return res.json(response);
      }

      const stats = logs.reduce(
        (acc, log) => {
          return {
            totalWorkouts: acc.totalWorkouts + 1,
            totalDuration: acc.totalDuration + log.duration,
            totalVolume: acc.totalVolume + Number(log.volume),
            totalSets: acc.totalSets + log.totalSets,
            muscleGroups: {
              ...acc.muscleGroups,
              ...Object.entries(log.muscleGroups).reduce((groups, [muscle, volume]) => ({
                ...groups,
                [muscle]: (acc.muscleGroups[muscle] || 0) + volume
              }), {})
            }
          };
        },
        { 
          totalWorkouts: 0, 
          totalDuration: 0, 
          totalVolume: 0,
          totalSets: 0,
          muscleGroups: {} as Record<string, number>
        }
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
