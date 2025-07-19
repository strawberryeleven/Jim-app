import { Request, Response } from 'express';
import Routine from '../models/routineModel';
import { ErrorResponse, RoutineResponse } from '../types';
import { mapRoutineToResponse } from '../utils/mappers';

export class RoutineController {
  static async getRoutines(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const routines = await Routine.find({ isPublic: true })
        .populate('createdBy', 'name email')
        .populate('exercises.exerciseId', 'name description')
        .skip(skip)
        .limit(limit)
        .lean();

      if (!routines) {
        const response: RoutineResponse = {
          success: true,
          routines: [],
          pagination: {
            total: 0,
            page,
            pages: 0
          }
        };
        return res.json(response);
      }

      const total = await Routine.countDocuments({ isPublic: true });

      const response: RoutineResponse = {
        success: true,
        routines: routines.map(routine => {
          try {
            return mapRoutineToResponse(routine);
          } catch (error) {
            console.error('Error mapping routine:', error);
            return null;
          }
        }).filter(Boolean),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (error) {
      console.error('Error in getRoutines:', error);
      const response: ErrorResponse = {
        success: false,
        error: 'Failed to fetch routines',
        code: 'FETCH_FAILED'
      };
      res.status(500).json(response);
    }
  }

  static async getRoutine(req: Request, res: Response) {
    try {
      const routine = await Routine.findById(req.params.id)
        .populate('createdBy', 'name email')
        .populate('exercises.exerciseId', 'name description')
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
        routine: mapRoutineToResponse(routine)
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
        .populate('exercises.exerciseId', 'name description')
        .lean();

      if (!populatedRoutine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Failed to create routine',
          code: 'CREATE_FAILED',
        };
        return res.status(500).json(response);
      }

      const response: RoutineResponse = {
        success: true,
        routine: mapRoutineToResponse(populatedRoutine)
      };
      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  }

  static async updateRoutine(req: Request, res: Response) {
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

      if (routine.createdBy.toString() !== (req as any).user.userId) {
        const response: ErrorResponse = {
          success: false,
          error: 'Unauthorized to update this routine',
          code: 'UNAUTHORIZED',
        };
        return res.status(403).json(response);
      }

      Object.assign(routine, req.body);
      await routine.save();

      const updatedRoutine = await Routine.findById(routine._id)
        .populate('createdBy', 'name email')
        .populate('exercises.exerciseId', 'name description')
        .lean();

      if (!updatedRoutine) {
        const response: ErrorResponse = {
          success: false,
          error: 'Failed to update routine',
          code: 'UPDATE_FAILED',
        };
        return res.status(500).json(response);
      }

      const response: RoutineResponse = {
        success: true,
        routine: mapRoutineToResponse(updatedRoutine)
      };
      res.json(response);
    } catch (error) {
      throw error;
    }
  }

  static async deleteRoutine(req: Request, res: Response) {
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

      if (routine.createdBy.toString() !== (req as any).user.userId) {
        const response: ErrorResponse = {
          success: false,
          error: 'Unauthorized to delete this routine',
          code: 'UNAUTHORIZED',
        };
        return res.status(403).json(response);
      }

      await routine.deleteOne();

      const response: RoutineResponse = {
        success: true,
        message: 'Routine deleted successfully'
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

      const userId = (req as any).user.userId;
      const likeIndex = routine.likes.indexOf(userId);

      if (likeIndex === -1) {
        routine.likes.push(userId);
        await routine.save();
        const response: RoutineResponse = {
          success: true,
          message: 'Routine liked successfully'
        };
        res.json(response);
      } else {
        routine.likes.splice(likeIndex, 1);
        await routine.save();
        const response: RoutineResponse = {
          success: true,
          message: 'Routine unliked successfully'
        };
        res.json(response);
      }
    } catch (error) {
      throw error;
    }
  }

  static async getUserRoutines(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Check if user is authenticated
      if (!(req as any).user) {
        const response: ErrorResponse = {
          success: false,
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        };
        return res.status(401).json(response);
      }

      // If userId is 'current', use the authenticated user's ID
      const userId = req.params.userId === 'current' 
        ? (req as any).user.userId 
        : req.params.userId;

      if (!userId) {
        const response: ErrorResponse = {
          success: false,
          error: 'Invalid user ID',
          code: 'INVALID_USER_ID'
        };
        return res.status(400).json(response);
      }

      const routines = await Routine.find({ createdBy: userId, isPublic: true })
        .populate('createdBy', 'name email')
        .populate('exercises.exerciseId', 'name description')
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Routine.countDocuments({ createdBy: userId, isPublic: true });

      const response: RoutineResponse = {
        success: true,
        routines: routines.map(routine => {
          try {
            return mapRoutineToResponse(routine);
          } catch (error) {
            console.error('Error mapping routine:', error);
            return null;
          }
        }).filter(Boolean),
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      };
      res.json(response);
    } catch (error) {
      console.error('Error in getUserRoutines:', error);
      const response: ErrorResponse = {
        success: false,
        error: 'Failed to fetch user routines',
        code: 'FETCH_FAILED'
      };
      res.status(500).json(response);
    }
  }
}
