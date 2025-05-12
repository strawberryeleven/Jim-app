import { API_ENDPOINTS } from '../config/api';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  videoUrl?: string;
  imageUrl?: string;
}

interface PaginatedResponse<T> {
  success: boolean;
  exercises: T[];
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

export const exerciseService = {
  async getAllExercises(page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Exercise>> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`${API_ENDPOINTS.exercises.getAll}?${queryParams}`, {
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
      console.error('Get exercises error:', error);
      throw error;
    }
  },

  async getExerciseById(id: string): Promise<Exercise> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.exercises.getById(id), {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.exercise;
    } catch (error) {
      console.error('Get exercise error:', error);
      throw error;
    }
  },

  async createExercise(exerciseData: Omit<Exercise, 'id'>): Promise<Exercise> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.exercises.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.exercise;
    } catch (error) {
      console.error('Create exercise error:', error);
      throw error;
    }
  },

  async updateExercise(id: string, exerciseData: Partial<Exercise>): Promise<Exercise> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.exercises.update(id), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(exerciseData),
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      return data.exercise;
    } catch (error) {
      console.error('Update exercise error:', error);
      throw error;
    }
  },

  async deleteExercise(id: string): Promise<void> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.exercises.delete(id), {
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
      console.error('Delete exercise error:', error);
      throw error;
    }
  },
}; 