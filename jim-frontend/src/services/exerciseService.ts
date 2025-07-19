import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string[];
  videoUrl: string;
  imageUrl: string;
  createdBy: any;
}

export interface ExerciseResponse {
  success: boolean;
  exercises: Exercise[];
}

// Helper function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with authorization
const getHeaders = () => {
  const token = getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const exerciseService = {
  getAllExercises: async (page = 1, limit = 10, search = ''): Promise<Exercise[]> => {
    try {
      const response = await axios.get<ExerciseResponse>(`${API_URL}/exercises`, {
        headers: getHeaders(),
        params: {
          page,
          limit,
          search
        }
      });
      return response.data.exercises;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw error;
    }
  },

  getExerciseById: async (id: string): Promise<Exercise> => {
    try {
      const response = await axios.get<ExerciseResponse>(`${API_URL}/exercises/${id}`, {
        headers: getHeaders()
      });
      return response.data.exercises[0];
    } catch (error) {
      console.error(`Error fetching exercise ${id}:`, error);
      throw error;
    }
  },

  // Transform backend exercise format to frontend format
  transformExercise: (exercise: Exercise) => {
    return {
      name: exercise.name,
      equipment: exercise.equipment.toLowerCase(),
      muscle: exercise.muscleGroup.toLowerCase(),
      image: exercise.imageUrl,
    };
  },

  // Get unique equipment and muscle groups from exercises
  getUniqueEquipmentAndMuscles: (exercises: Exercise[]) => {
    const equipment = new Set(exercises.map(ex => ex.equipment.toLowerCase()));
    const muscles = new Set(exercises.map(ex => ex.muscleGroup.toLowerCase()));
    
    return {
      equipmentList: Array.from(equipment),
      muscleList: Array.from(muscles)
    };
  }
}; 