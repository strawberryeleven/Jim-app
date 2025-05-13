import { API_ENDPOINTS } from '../config/api';
import { getToken } from '../utils/auth';
import { handleApiError } from '../utils/error';
import { PaginatedResponse } from '../types/api';
import { WorkoutLog } from '../types/workout';
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

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  exercisesCompleted: number;
  averageDuration: number;
  mostFrequentWorkout: string;
  recentWorkouts: WorkoutLog[];
}

interface CreateWorkoutLogData {
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic?: boolean;
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
}

// Dummy API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dummy data
const dummyLogs: Record<string, WorkoutLog[]> = {
  "2024-03-20": [
    {
      id: "1",
      title: "Upper Body Power",
      time: "14:30",
      volume: "2500",
      date: "2024-03-20",
      isPublic: true,
      notes: "Felt strong today!",
      exercises: [
        {
          name: "Bench Press",
          sets: 4,
          image: "https://example.com/bench-press.jpg",
          weight: 80,
          reps: 8,
          muscle: "chest"
        },
        {
          name: "Pull-ups",
          sets: 3,
          image: "https://example.com/pull-ups.jpg",
          weight: 0,
          reps: 10,
          muscle: "back"
        }
      ],
      totalSets: 7,
      duration: 45,
      muscleGroups: {
        chest: 2560,
        back: 0
      }
    }
  ],
  "2024-03-19": [
    {
      id: "2",
      title: "Leg Day",
      time: "10:00",
      volume: "3000",
      date: "2024-03-19",
      isPublic: true,
      exercises: [
        {
          name: "Squats",
          sets: 5,
          image: "https://example.com/squats.jpg",
          weight: 120,
          reps: 5,
          muscle: "legs"
        }
      ],
      totalSets: 5,
      duration: 60,
      muscleGroups: {
        legs: 3000
      }
    }
  ]
};

class WorkoutLogService {
  async getWorkoutLogs(): Promise<{ data: Record<string, WorkoutLog[]> }> {
    await delay(500); // Simulate API delay
    return { data: dummyLogs };
  }

  async addWorkoutLog(log: WorkoutLog): Promise<{ data: WorkoutLog }> {
    await delay(500);
    if (!dummyLogs[log.date]) {
      dummyLogs[log.date] = [];
    }
    dummyLogs[log.date].push(log);
    return { data: log };
  }

  async getWorkoutStats(): Promise<{
    totalWorkouts: number;
    totalVolume: number;
    totalSets: number;
    totalDuration: number;
    muscleGroupDistribution: Record<string, number>;
  }> {
    await delay(500);
    
    const stats = {
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalDuration: 0,
      muscleGroupDistribution: {} as Record<string, number>
    };

    Object.values(dummyLogs).forEach(logs => {
      logs.forEach(log => {
        stats.totalWorkouts++;
        stats.totalVolume += parseInt(log.volume);
        stats.totalSets += log.totalSets;
        stats.totalDuration += log.duration;

        Object.entries(log.muscleGroups).forEach(([muscle, volume]) => {
          stats.muscleGroupDistribution[muscle] = (stats.muscleGroupDistribution[muscle] || 0) + (volume as number);
        });
      });
    });

    return stats;
  }

  async createWorkoutLog(logData: CreateWorkoutLogData): Promise<WorkoutLog> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      // Log the request data for debugging
      console.log('Sending workout log data:', JSON.stringify(logData, null, 2));

      // Validate required fields
      if (!logData.title || !logData.time || !logData.volume || !logData.date || 
          !logData.exercises?.length || !logData.totalSets || !logData.duration || 
          !logData.muscleGroups) {
        console.error('Validation failed:', {
          title: !!logData.title,
          time: !!logData.time,
          volume: !!logData.volume,
          date: !!logData.date,
          exercises: logData.exercises?.length,
          totalSets: logData.totalSets,
          duration: logData.duration,
          muscleGroups: !!logData.muscleGroups
        });
        throw new Error('Missing required fields');
      }

      // Validate exercises
      for (const exercise of logData.exercises) {
        if (!exercise.name || !exercise.sets || !exercise.image) {
          console.error('Invalid exercise:', exercise);
          throw new Error('Invalid exercise data');
        }
      }

      const response = await fetch(API_ENDPOINTS.workoutLogs.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...logData,
          isPublic: logData.isPublic ?? false,
        }),
        credentials: 'include',
      });

      // Log the response status and headers
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error response:', errorData);
        throw new Error(errorData.message || 'Failed to create workout log');
      }

      const data = await response.json();
      console.log('Server success response:', data);
      
      if (!data.success || !data.workoutLog) {
        throw new Error('Invalid response from server');
      }

      return data.workoutLog;
    } catch (error) {
      console.error('Create workout log error:', error);
      throw error;
    }
  }

  async getAllWorkoutLogs(page = 1, limit = 10, isPublic?: boolean): Promise<PaginatedResponse<WorkoutLog>> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No token found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // Add isPublic filter if provided
      if (isPublic !== undefined) {
        queryParams.append('isPublic', isPublic.toString());
      }

      console.log('Fetching workout logs with params:', Object.fromEntries(queryParams.entries()));

      const response = await fetch(`${API_ENDPOINTS.workoutLogs.getAll}?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();
      console.log('Received workout logs response:', data);

      if (!data.success || !Array.isArray(data.workoutLogs)) {
        throw new Error('Invalid response format from server');
      }

      return {
        success: data.success,
        logs: data.workoutLogs,
        pagination: data.pagination
      };
    } catch (error) {
      console.error('Get workout logs error:', error);
      throw error;
    }
  }

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
  }

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
  }

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
  }

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
  }
}

export const workoutLogService = new WorkoutLogService(); 