import { API_ENDPOINTS } from '../config/api';
import { Workout } from './workoutService';

export interface RoutineWorkout {
  workoutId: string;
  day: number;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  workouts: RoutineWorkout[];
  createdBy: string;
  isPublic: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  routines: T[];
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

export const routineService = {
  async getAllRoutines(page = 1, limit = 10): Promise<PaginatedResponse<Routine>> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_ENDPOINTS.routines.getAll}?${queryParams}`, {
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
      console.error('Get routines error:', error);
      throw error;
    }
  },

  async getRoutineById(id: string): Promise<Routine> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.getById(id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.routine;
    } catch (error) {
      console.error('Get routine error:', error);
      throw error;
    }
  },

  async createRoutine(routineData: Omit<Routine, 'id' | 'createdBy' | 'likes' | 'createdAt' | 'updatedAt'>): Promise<Routine> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routineData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.routine;
    } catch (error) {
      console.error('Create routine error:', error);
      throw error;
    }
  },

  async updateRoutine(id: string, routineData: Partial<Routine>): Promise<Routine> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.update(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routineData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.routine;
    } catch (error) {
      console.error('Update routine error:', error);
      throw error;
    }
  },

  async deleteRoutine(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.delete(id), {
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
      console.error('Delete routine error:', error);
      throw error;
    }
  },

  async likeRoutine(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.like(id), {
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
      console.error('Like routine error:', error);
      throw error;
    }
  },

  async getUserRoutines(userId: string): Promise<Routine[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.getUserRoutines(userId), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.routines;
    } catch (error) {
      console.error('Get user routines error:', error);
      throw error;
    }
  },
}; 