import { Request, Response } from 'express';
import Workout from '../models/workoutModel';
import Exercise from '../models/exerciseModel';
import { ErrorResponse, WorkoutResponse } from '../types';
import { mapWorkoutToResponse } from '../utils/mappers';

export class WorkoutController {
  static async getWorkouts(req: Request, res: Response) {
    try {
      const workouts = await Workout.find({ isPublic: true })
        .populate('createdBy', 'name email')
        .populate('exercises.exercise', 'name description')
        .lean();

      const mappedWorkouts = workouts
        .map(mapWorkoutToResponse)
        .filter((workout): workout is NonNullable<typeof workout> => workout !== undefined);

      const response: WorkoutResponse = {
        success: true,
        workouts: mappedWorkouts,
      };
      res.json(response);
    } catch (error) {
      const response: ErrorResponse = {
        success: false,
        error: (error as Error).message,
        code: 'INTERNAL_ERROR'
      };
      res.status(500).json(response);
    }
  }

  static async getUserWorkouts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const workouts = await Workout.find({ createdBy: req.params.userId })
        .populate('createdBy', 'name email')
        .populate('exercises.exercise', 'name description')
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Workout.countDocuments({ createdBy: req.params.userId });

      const mappedWorkouts = workouts
        .map(mapWorkoutToResponse)
        .filter((workout): workout is NonNullable<typeof workout> => workout !== undefined);

      const response: WorkoutResponse = {
        success: true,
        workouts: mappedWorkouts,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (error) {
      const response: ErrorResponse = {
        success: false,
        error: (error as Error).message,
        code: 'INTERNAL_ERROR'
      };
      res.status(500).json(response);
    }
  }

  static async getWorkout(req: Request, res: Response) {
    try {
      const workout = await Workout.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('exercises.exercise', 'name description')
        .lean();
      if (!workout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout not found',
          code: 'WORKOUT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      if (!workout.isPublic && workout.createdBy.toString() !== (req as any).user.userId) {
        const response: ErrorResponse = {
          success: false,
          error: 'Unauthorized access to private workout',
          code: 'UNAUTHORIZED',
        };
        return res.status(403).json(response);
      }

      const response: WorkoutResponse = {
        success: true,
        workout: mapWorkoutToResponse(workout),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async createWorkout(req: Request, res: Response) {
    try {
      // Validate that all exercises exist
      const exerciseIds = req.body.exercises.map((e: any) => e.exercise);
      const exercises = await Exercise.find({ _id: { $in: exerciseIds } });
      
      if (exercises.length !== exerciseIds.length) {
        const response: ErrorResponse = {
          success: false,
          error: 'One or more exercises not found',
          code: 'INVALID_INPUT',
        };
        return res.status(400).json(response);
      }

      const workout = new Workout({
        ...req.body,
        createdBy: (req as any).user.userId,
      });
      await workout.save();

      const populatedWorkout = await Workout.findById(workout._id)
        .populate('createdBy', 'name email')
        .populate('exercises.exercise', 'name description')
        .lean();

      if (!populatedWorkout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Failed to create workout',
          code: 'INTERNAL_ERROR',
        };
        return res.status(500).json(response);
      }

      const response: WorkoutResponse = {
        success: true,
        workout: mapWorkoutToResponse(populatedWorkout),
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ErrorResponse = {
        success: false,
        error: (error as Error).message,
        code: 'INTERNAL_ERROR',
      };
      res.status(500).json(response);
    }
  }

  static async updateWorkout(req: Request, res: Response) {
    try {
      const workout = await Workout.findOneAndUpdate(
        { _id: req.params.id, createdBy: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      )
        .populate('createdBy', 'name email')
        .populate('exercises.exercise', 'name description')
        .lean();
      if (!workout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout not found or unauthorized',
          code: 'WORKOUT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: WorkoutResponse = {
        success: true,
        workout: mapWorkoutToResponse(workout),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteWorkout(req: Request, res: Response) {
    try {
      const workout = await Workout.findOneAndDelete({
        _id: req.params.id,
        createdBy: (req as any).user.userId,
      });
      if (!workout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout not found or unauthorized',
          code: 'WORKOUT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: WorkoutResponse = {
        success: true,
        message: 'Workout deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async likeWorkout(req: Request, res: Response) {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout not found',
          code: 'WORKOUT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await Workout.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: (req as any).user.userId },
      });

      const response: WorkoutResponse = {
        success: true,
        message: 'Workout liked successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async unlikeWorkout(req: Request, res: Response) {
    try {
      const workout = await Workout.findById(req.params.id);
      if (!workout) {
        const response: ErrorResponse = {
          success: false,
          error: 'Workout not found',
          code: 'WORKOUT_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await Workout.findByIdAndUpdate(req.params.id, {
        $pull: { likes: (req as any).user.userId },
      });

      const response: WorkoutResponse = {
        success: true,
        message: 'Workout unliked successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}