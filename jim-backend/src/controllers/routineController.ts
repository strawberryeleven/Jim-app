
import { Request, Response } from 'express';
import Routine from '../models/routineModel';
import { ErrorResponse, RoutineResponse } from '../types';
import { mapRoutineToResponse } from '../utils/mappers';

export class RoutineController {
  static async getRoutines(req: Request, res: Response) {
    try {
      const routines = await Routine.find({ isPublic: true })
        .populate('createdBy', 'name email')
        .populate('workouts.workout', 'name description')
        .lean();
      const response: RoutineResponse = {
        success: true,
        routines: routines.map(mapRoutineToResponse),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('workouts.workout', 'name description')
        .lean();
      if (!routine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Routine not found',
          code: 'ROUTINE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      if (!routine.isPublic && routine.createdBy.toString() !== (req as any).user.userId) {
        const response: ErrorResponse = {
          success: false,
          error: 'Unauthorized access to private routine',
          code: 'UNAUTHORIZED',
        };
        return res.status(403).json(response);
      }

      const response: RoutineResponse = {
        success: true,
        routine: mapRoutineToResponse(routine),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async createRoutine(req: Request, res: Response) {
    try {
      const routine = new Routine({
        ...req.body,
        createdBy: (req as any).user.userId,
      });
      await routine.save();

      const populatedRoutine = await Routine.findById(routine._id)
        .populate('createdBy', 'name email')
        .populate('workouts.workout', 'name description')
        .lean();

      const response: RoutineResponse = {
        success: true,
        routine: mapRoutineToResponse(populatedRoutine!),
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findOneAndUpdate(
        { _id: req.params.id, createdBy: (req as any).user.userId },
        { ...req.body, updatedAt: new Date() },
        { new: true }
      )
        .populate('createdBy', 'name email')
        .populate('workouts.workout', 'name description')
        .lean();
      if (!routine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Routine not found or unauthorized',
          code: 'ROUTINE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: RoutineResponse = {
        success: true,
        routine: mapRoutineToResponse(routine),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findOneAndDelete({
        _id: req.params.id,
        createdBy: (req as any).user.userId,
      });
      if (!routine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Routine not found or unauthorized',
          code: 'ROUTINE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      const response: RoutineResponse = {
        success: true,
        message: 'Routine deleted successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async likeRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findById(req.params.id);
      if (!routine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Routine not found',
          code: 'ROUTINE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await Routine.findByIdAndUpdate(req.params.id, {
        $addToSet: { likes: (req as any).user.userId },
      });

      const response: RoutineResponse = {
        success: true,
        message: 'Routine liked successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async unlikeRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findById(req.params.id);
      if (!routine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Routine not found',
          code: 'ROUTINE_NOT_FOUND',
        };
        return res.status(404).json(response);
      }

      await Routine.findByIdAndUpdate(req.params.id, {
        $pull: { likes: (req as any).user.userId },
      });

      const response: RoutineResponse = {
        success: true,
        message: 'Routine unliked successfully',
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async getUserRoutines(req: Request, res: Response) {
    try {
      const routines = await Routine.find({ createdBy: req.params.userId, isPublic: true })
        .populate('createdBy', 'name email')
        .populate('workouts.workout', 'name description')
        .lean();
      const response: RoutineResponse = {
        success: true,
        routines: routines.map(mapRoutineToResponse),
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }
}
