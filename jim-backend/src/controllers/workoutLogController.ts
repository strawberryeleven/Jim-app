import { Request, Response } from 'express';
import WorkoutLog from '../models/workoutLogModel';
import { ErrorResponse, WorkoutLogResponse } from '../types';
import { mapWorkoutLogToResponse } from '../utils/mappers';
import User from '../models/userModel';

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

  static async getFollowedUsersWorkoutLogs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Get the current user's following list
      const currentUser = await User.findById((req as any).user.userId);
      if (!currentUser) {
        const response: ErrorResponse = {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      // Get workout logs from followed users that are public
      const logs = await WorkoutLog.find({
        userId: { $in: currentUser.following },
        isPublic: true
      })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email')
        .lean();

      const total = await WorkoutLog.countDocuments({
        userId: { $in: currentUser.following },
        isPublic: true
      });

      const response: WorkoutLogResponse = {
        success: true,
        logs: logs.map(log => ({
          id: log._id.toString(),
          userId: log.userId._id.toString(),
          userName: (log.userId as any).name,
          title: log.title,
          time: log.time,
          volume: log.volume,
          date: new Date(log.date),
          isPublic: log.isPublic,
          notes: log.notes,
          exercises: log.exercises,
          totalSets: log.totalSets,
          duration: log.duration,
          muscleGroups: log.muscleGroups
        })),
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
