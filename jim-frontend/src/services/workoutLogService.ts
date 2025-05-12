import { API_ENDPOINTS } from '../config/api';
import { Workout } from './workoutService';

export interface WorkoutLogExercise {
  exerciseId: string;
  sets: {
    reps: number;
    weight?: number;
    duration?: number;
    completed: boolean;
  }[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  userId: string;
  exercises: WorkoutLogExercise[];
  notes?: string;
  duration: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  exercisesCompleted: number;
  averageDuration: number;
  mostFrequentWorkout: string;
  recentWorkouts: WorkoutLog[];
}

interface PaginatedResponse<T> {
  success: boolean;
  logs: T[];
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

export const workoutLogService = {
  async createWorkoutLog(logData: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<WorkoutLog> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.log;
    } catch (error) {
      console.error('Create workout log error:', error);
      throw error;
    }
  },

  async getAllWorkoutLogs(page = 1, limit = 10): Promise<PaginatedResponse<WorkoutLog>> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_ENDPOINTS.workoutLogs.getAll}?${queryParams}`, {
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
      console.error('Get workout logs error:', error);
      throw error;
    }
  },

  async getWorkoutLogById(id: string): Promise<WorkoutLog> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.getById(id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.log;
    } catch (error) {
      console.error('Get workout log error:', error);
      throw error;
    }
  },

  async updateWorkoutLog(id: string, logData: Partial<WorkoutLog>): Promise<WorkoutLog> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.update(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.log;
    } catch (error) {
      console.error('Update workout log error:', error);
      throw error;
    }
  },

  async deleteWorkoutLog(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.delete(id), {
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
      console.error('Delete workout log error:', error);
      throw error;
    }
  },

  async getUserWorkoutLogs(userId: string): Promise<WorkoutLog[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.getUserLogs(userId), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.logs;
    } catch (error) {
      console.error('Get user workout logs error:', error);
      throw error;
    }
  },

  async getWorkoutStats(): Promise<WorkoutStats> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.getStats, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Get workout stats error:', error);
      throw error;
    }
  },
}; 