import { API_ENDPOINTS } from '../config/api';
import { getToken } from '../utils/auth';
import { exerciseService } from './exerciseService';

export interface ExerciseSet {
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

export interface RoutineExercise {
  exerciseId: string;
  sets: ExerciseSet[];
  order: number;
  exerciseDetails?: {
    name: string;
    description: string;
    muscleGroup: string;
    equipment: string;
    imageUrl: string;
  };
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: RoutineExercise[];
  createdBy: string;
  isPublic: boolean;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoutineData {
  name: string;
  description: string;
  exercises: RoutineExercise[];
  isPublic?: boolean;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
}

export interface RoutinesResponse {
  success: boolean;
  routines: Routine[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  success: boolean;
  routine?: T;
  error?: string;
  code?: string;
}

export const routineService = {
  async createRoutine(routineData: CreateRoutineData): Promise<Routine> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      // Ensure all required fields are present
      if (!routineData.name || !routineData.description || !routineData.exercises || routineData.exercises.length === 0) {
        throw new Error('Missing required fields: name, description, or exercises');
      }

      // Format the data exactly as per API specification
      const formattedData = {
        name: routineData.name.trim(),
        description: routineData.description.trim(),
        exercises: routineData.exercises.map((exercise, index) => ({
          exerciseId: exercise.exerciseId,
          sets: exercise.sets.map(set => ({
            weight: Number(set.weight) || 0,
            reps: Math.max(1, Number(set.reps) || 1),
            isCompleted: false
          })),
          order: index + 1
        })),
        isPublic: routineData.isPublic || false
      };

      console.log('Sending routine data:', JSON.stringify(formattedData, null, 2));

      const response = await fetch(API_ENDPOINTS.routines.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
        credentials: 'include',
      });

      const data: ApiResponse<Routine> = await response.json();

      if (!response.ok) {
        console.error('Server response:', data);
        throw new Error(data.error || 'Failed to create routine');
      }

      if (!data.success || !data.routine) {
        throw new Error('Invalid response from server');
      }

      return data.routine;
    } catch (error) {
      console.error('Create routine error:', error);
      throw error;
    }
  },

  async getAllRoutines(page = 1, limit = 10): Promise<{ routines: Routine[]; pagination: PaginationInfo }> {
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
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(errorData.error || `Failed to fetch routines: ${response.statusText}`);
      }

      const data: RoutinesResponse = await response.json();

      // Check if the response has the expected structure
      if (!data.success || !Array.isArray(data.routines) || !data.pagination) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Fetch exercise details for each exercise in each routine
      const routinesWithExerciseDetails = await Promise.all(
        data.routines.map(async (routine: Routine) => {
          const exercisesWithDetails = await Promise.all(
            routine.exercises.map(async (exercise: RoutineExercise) => {
              try {
                const exerciseDetails = await exerciseService.getExerciseById(exercise.exerciseId);
                return {
                  ...exercise,
                  exerciseDetails: {
                    name: exerciseDetails.name,
                    description: exerciseDetails.description,
                    muscleGroup: exerciseDetails.muscleGroup,
                    equipment: exerciseDetails.equipment,
                    imageUrl: exerciseDetails.imageUrl,
                  }
                };
              } catch (error) {
                console.error(`Failed to fetch exercise details for ID ${exercise.exerciseId}:`, error);
                return exercise;
              }
            })
          );
          return {
            ...routine,
            exercises: exercisesWithDetails
          };
        })
      );

      return {
        routines: routinesWithExerciseDetails,
        pagination: data.pagination
      };
    } catch (error) {
      console.error('Get routines error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch routines: ${error.message}`);
      }
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

      const data: ApiResponse<Routine> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch routine');
      }

      if (!data.success || !data.routine) {
        throw new Error('Invalid response from server');
      }

      // Fetch exercise details for each exercise in the routine
      const exercisesWithDetails = await Promise.all(
        data.routine.exercises.map(async (exercise) => {
          try {
            const exerciseDetails = await exerciseService.getExerciseById(exercise.exerciseId);
            return {
              ...exercise,
              exerciseDetails: {
                name: exerciseDetails.name,
                description: exerciseDetails.description,
                muscleGroup: exerciseDetails.muscleGroup,
                equipment: exerciseDetails.equipment,
                imageUrl: exerciseDetails.imageUrl,
              }
            };
          } catch (error) {
            console.error(`Failed to fetch exercise details for ID ${exercise.exerciseId}:`, error);
            return exercise;
          }
        })
      );

      return {
        ...data.routine,
        exercises: exercisesWithDetails
      };
    } catch (error) {
      console.error('Get routine error:', error);
      throw error;
    }
  },

  async updateRoutine(id: string, routineData: Partial<CreateRoutineData>): Promise<Routine> {
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

      const data: ApiResponse<Routine> = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update routine');
      }

      if (!data.success || !data.routine) {
        throw new Error('Invalid response from server');
      }

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
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete routine');
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
        const data = await response.json();
        throw new Error(data.error || 'Failed to like routine');
      }
    } catch (error) {
      console.error('Like routine error:', error);
      throw error;
    }
  },

  async getUserRoutines(userId: string = "current"): Promise<Routine[]> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(API_ENDPOINTS.routines.getUserRoutines(userId), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        throw new Error(errorData.error || `Failed to fetch user routines: ${response.statusText}`);
      }

      const data = await response.json();

      // Check if the response has the expected structure
      if (!data.success || !Array.isArray(data.routines)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Fetch exercise details for each exercise in each routine
      const routinesWithExerciseDetails = await Promise.all(
        data.routines.map(async (routine: Routine) => {
          const exercisesWithDetails = await Promise.all(
            routine.exercises.map(async (exercise: RoutineExercise) => {
              try {
                const exerciseDetails = await exerciseService.getExerciseById(exercise.exerciseId);
                return {
                  ...exercise,
                  exerciseDetails: {
                    name: exerciseDetails.name,
                    description: exerciseDetails.description,
                    muscleGroup: exerciseDetails.muscleGroup,
                    equipment: exerciseDetails.equipment,
                    imageUrl: exerciseDetails.imageUrl,
                  }
                };
              } catch (error) {
                console.error(`Failed to fetch exercise details for ID ${exercise.exerciseId}:`, error);
                return exercise;
              }
            })
          );
          return {
            ...routine,
            exercises: exercisesWithDetails
          };
        })
      );

      return routinesWithExerciseDetails;
    } catch (error) {
      console.error('Get user routines error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch user routines: ${error.message}`);
      }
      throw error;
    }
  },
}; 