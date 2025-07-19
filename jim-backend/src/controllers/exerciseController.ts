
import { Request, Response } from 'express';
import Exercise from '../models/exerciseModel';
import { ErrorResponse, ExerciseResponse } from '../types';
import { mapExerciseToResponse } from '../utils/mappers';

export class ExerciseController {
  static async getExercises(req: Request, res: Response) {
    try {
      const exercises = await Exercise.find()
        .populate('createdBy', 'name email')
        .lean();
      const response: ExerciseResponse = {
        success: true,
        exercises: exercises.map(mapExerciseToResponse),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getExercise(req: Request, res: Response) {
    try {
      const exercise = await Exercise.findById(req.params.id)
        .populate('createdBy', 'name email')
        .lean();
      if (!exercise) {
        const response: ErrorResponse = {
          success: false,
          error: 'Exercise not found',
          code: 'EXERCISE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: ExerciseResponse = {
        success: true,
        exercise: mapExerciseToResponse(exercise),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async createExercise(req: Request, res: Response) {
    try {
      const exercise = new Exercise({
        ...req.body,
        createdBy: (req as any).user.userId,
      });
      await exercise.save();

      const populatedExercise = await Exercise.findById(exercise._id)
        .populate('createdBy', 'name email')
        .lean();

      const response: ExerciseResponse = {
        success: true,
        exercise: mapExerciseToResponse(populatedExercise!),
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateExercise(req: Request, res: Response) {
    try {
      const exercise = await Exercise.findOneAndUpdate(
        { _id: req.params.id, createdBy: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      )
        .populate('createdBy', 'name email')
        .lean();
      if (!exercise) {
        const response: ErrorResponse = {
          success: false,
          error: 'Exercise not found or unauthorized',
          code: 'EXERCISE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: ExerciseResponse = {
        success: true,
        exercise: mapExerciseToResponse(exercise),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteExercise(req: Request, res: Response) {
    try {
      const exercise = await Exercise.findOneAndDelete({
        _id: req.params.id,
        createdBy: (req as any).user.userId,
      });
      if (!exercise) {
        const response: ErrorResponse = {
          success: false,
          error: 'Exercise not found or unauthorized',
          code: 'EXERCISE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: ExerciseResponse = {
        success: true,
        message: 'Exercise deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getCategories(req: Request, res: Response) {
    try {
      const categories = await Exercise.distinct('category');
      const response: ExerciseResponse = {
        success: true,
        categories,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getMuscleGroups(req: Request, res: Response) {
    try {
      const muscleGroups = await Exercise.distinct('muscleGroup');
      const response: ExerciseResponse = {
        success: true,
        muscleGroups,
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}