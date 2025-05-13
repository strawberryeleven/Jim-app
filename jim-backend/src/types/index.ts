import { Types } from 'mongoose';

export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  message?: string;
}

export interface ErrorResponse {
  success: boolean;
  error: string;
  code: string;
}

export interface UserResponse {
  success: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    followers: string[];
    following: string[];
  };
  message?: string;
}

export interface UsersResponse {
  success: boolean;
  users?: {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    followers: string[];
    following: string[];
  }[];
  message?: string;
}

export interface ExerciseResponse {
  success: boolean;
  exercise?: {
    id: string;
    name: string;
    description: string;
    category: string;
    muscleGroup: string;
    equipment: string;
    difficulty: string;
    instructions: string[];
    videoUrl?: string;
    imageUrl?: string;
    createdBy: string;
  };
  exercises?: any[];
  categories?: string[];
  muscleGroups?: string[];
  message?: string;
}

export interface WorkoutResponse {
  success: boolean;
  workout?: {
    id: string;
    name: string;
    description: string;
    exercises: {
      exercise: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number;
      restTime: number;
    }[];
    createdBy: string;
    isPublic: boolean;
    likes: string[];
  };
  workouts?: {
    id: string;
    name: string;
    description: string;
    exercises: {
      exercise: string;
      sets: number;
      reps: number;
      weight?: number;
      duration?: number;
      restTime: number;
    }[];
    createdBy: string;
    isPublic: boolean;
    likes: string[];
  }[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  message?: string;
}

export interface WorkoutLogResponse {
  success: boolean;
  log?: {
    id: string;
    userId: string;
    title: string;
    time: string;
    volume: string;
    date: Date;
    isPublic: boolean;
    notes?: string;
    exercises: {
      name: string;
      sets: number;
      image: string;
      weight?: number;
      reps?: number;
      muscle?: string;
    }[];
    totalSets: number;
    duration: number;
    muscleGroups: Record<string, number>;
  };
  logs?: any[];
  stats?: {
    totalWorkouts: number;
    totalDuration: number;
    totalVolume: number;
    totalSets: number;
    muscleGroups: Record<string, number>;
  };
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  message?: string;
}

export interface RoutineResponse {
  success: boolean;
  routine?: {
    id: string;
    name: string;
    description: string;
    exercises: {
      exerciseId: string;
      sets: {
        weight: number;
        reps: number;
        isCompleted: boolean;
      }[];
      order: number;
    }[];
    createdBy: string;
    isPublic: boolean;
    likes: string[];
    createdAt: string;
    updatedAt: string;
  };
  routines?: any[];
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
  message?: string;
}