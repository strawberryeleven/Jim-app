import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ErrorResponse } from '../types';

const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: (error as Error).message,
      code: 'AUTH001',
    };
    res.status(400).json(response);
  }
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: (error as Error).message,
      code: 'AUTH001',
    };
    res.status(400).json(response);
  }
};

const exerciseSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
  muscleGroup: z.string().min(1),
  equipment: z.string().min(1),
  difficulty: z.string().min(1),
  instructions: z.array(z.string()).min(1),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});

const exerciseUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  muscleGroup: z.string().min(1).optional(),
  equipment: z.string().min(1).optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  instructions: z.array(z.string()).min(1).optional(),
  videoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
});

const routineSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  exercises: z.array(
    z.object({
      exerciseId: z.string().min(1),
      sets: z.array(
        z.object({
          weight: z.number().min(0),
          reps: z.number().min(1),
          isCompleted: z.boolean().optional()
        })
      ).min(1),
      order: z.number().int().min(1)
    })
  ).min(1),
  isPublic: z.boolean().optional()
});

const routineUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  exercises: z.array(
    z.object({
      exerciseId: z.string().min(1),
      sets: z.array(
        z.object({
          weight: z.number().min(0),
          reps: z.number().min(1),
          isCompleted: z.boolean().optional()
        })
      ).min(1),
      order: z.number().int().min(1)
    })
  ).min(1).optional(),
  isPublic: z.boolean().optional()
});

const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  profileImage: z.string().url().optional(),
  bio: z.string().optional(),
});

const workoutSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  exercises: z.array(
    z.object({
      exercise: z.string().min(1),
      sets: z.number().int().min(1),
      reps: z.number().int().min(1),
      weight: z.number().optional(),
      duration: z.number().optional(),
      restTime: z.number().int().min(0),
    })
  ).min(1),
  isPublic: z.boolean(),
});

const workoutUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  exercises: z.array(
    z.object({
      exercise: z.string().min(1),
      sets: z.number().int().min(1),
      reps: z.number().int().min(1),
      weight: z.number().optional(),
      duration: z.number().optional(),
      restTime: z.number().int().min(0),
    })
  ).min(1).optional(),
  isPublic: z.boolean().optional(),
});

const exerciseSummarySchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().int().min(1, 'At least one set is required'),
  image: z.string().min(1, 'Image path is required'),
  weight: z.number().optional(),
  reps: z.number().int().optional(),
  muscle: z.string().optional()
});

const workoutLogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  time: z.string().min(1, 'Time is required'),
  volume: z.string().min(1, 'Volume is required'),
  date: z.string().datetime('Valid date is required'),
  isPublic: z.boolean().default(false),
  notes: z.string().optional(),
  exercises: z.array(exerciseSummarySchema).min(1, 'At least one exercise is required'),
  totalSets: z.number().int().min(1, 'Total sets must be at least 1'),
  duration: z.number().int().min(1, 'Duration must be at least 1 minute'),
  muscleGroups: z.record(z.string(), z.number())
});

const workoutLogUpdateSchema = z.object({
  workout: z.string().min(1).optional(),
  date: z.string().datetime().optional(),
  exercises: z.array(
    z.object({
      exercise: z.string().min(1),
      sets: z.array(
        z.object({
          reps: z.number().int().min(1),
          weight: z.number().optional(),
          duration: z.number().optional(),
          completed: z.boolean(),
        })
      ).min(1),
    })
  ).min(1).optional(),
  notes: z.string().optional(),
  duration: z.number().int().min(0).optional(),
});

const updateNameSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const updateEmailSchema = z.object({
  email: z.string().email('Invalid email format'),
});

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters long'),
});

const profileSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  bio: z.string().optional(),
  link: z.string().url().optional(),
  sex: z.enum(['male', 'female', 'other']).optional(),
  DOB: z.string().datetime().optional(),
});

const measurementSchema = z.object({
  date: z.string().datetime(),
  weight: z.number().min(0),
  chest: z.number().min(0),
  waist: z.number().min(0),
  arms: z.number().min(0),
});

export const validateExercise = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'PUT') {
      exerciseUpdateSchema.parse(req.body);
    } else {
      exerciseSchema.parse(req.body);
    }
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid exercise input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateRoutine = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'PUT') {
      routineUpdateSchema.parse(req.body);
    } else {
      routineSchema.parse(req.body);
    }
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid routine input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateProfileSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid profile update input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateWorkout = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.method === 'PUT') {
      workoutUpdateSchema.parse(req.body);
    } else {
      workoutSchema.parse(req.body);
    }
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid workout input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateWorkoutLog = (req: Request, res: Response, next: NextFunction) => {
  try {
    workoutLogSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid workout log input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateUpdateName = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateNameSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid name update input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateUpdateEmail = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateEmailSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid email update input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateUpdatePassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    updatePasswordSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid password update input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    profileSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid profile input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};

export const validateMeasurement = (req: Request, res: Response, next: NextFunction) => {
  try {
    measurementSchema.parse(req.body);
    next();
  } catch (error) {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid measurement input',
      code: 'INVALID_INPUT',
    };
    res.status(400).json(response);
  }
};