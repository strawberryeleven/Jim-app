import { API_ENDPOINTS } from '../config/api';
import { Exercise } from './exerciseService';

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  restTime: number;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  createdBy: string;
  isPublic: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  workouts: T[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

interface ErrorResponse {
  success: false;
  error: string;
  code: string;
}

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to handle API errors
const handleApiError = async (response: Response) => {
  const data = await response.json() as ErrorResponse;
  throw new Error(data.error || 'An error occurred');
};

export const workoutService = {
  async getAllWorkouts(page = 1, limit = 10): Promise<PaginatedResponse<Workout>> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_ENDPOINTS.workouts.getAll}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      return await response.json();
    } catch (error) {
      console.error('Get workouts error:', error);
      throw error;
    }
  },

  async getWorkoutById(id: string): Promise<Workout> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.getById(id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.workout;
    } catch (error) {
      console.error('Get workout error:', error);
      throw error;
    }
  },

  async createWorkout(workoutData: Omit<Workout, 'id' | 'createdBy' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.workout;
    } catch (error) {
      console.error('Create workout error:', error);
      throw error;
    }
  },

  async updateWorkout(id: string, workoutData: Partial<Workout>): Promise<Workout> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.update(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workoutData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.workout;
    } catch (error) {
      console.error('Update workout error:', error);
      throw error;
    }
  },

  async deleteWorkout(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.delete(id), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Delete workout error:', error);
      throw error;
    }
  },

  async likeWorkout(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.like(id), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }
    } catch (error) {
      console.error('Like workout error:', error);
      throw error;
    }
  },

  async getUserWorkouts(userId: string): Promise<Workout[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workouts.getUserWorkouts(userId), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.workouts;
    } catch (error) {
      console.error('Get user workouts error:', error);
      throw error;
    }
  },
}; 