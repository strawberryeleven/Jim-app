import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { exerciseService, Exercise } from '../../services/exerciseService';

interface ExerciseState {
  exercises: Exercise[];
  selectedExercise: Exercise | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: ExerciseState = {
  exercises: [],
  selectedExercise: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchExercises = createAsyncThunk(
  'exercises/fetchAll',
  async ({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await exerciseService.getAllExercises(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exercises');
    }
  }
);

export const fetchExerciseById = createAsyncThunk(
  'exercises/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const exercise = await exerciseService.getExerciseById(id);
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch exercise');
    }
  }
);

export const createExercise = createAsyncThunk(
  'exercises/create',
  async (exerciseData: Omit<Exercise, 'id'>, { rejectWithValue }) => {
    try {
      const exercise = await exerciseService.createExercise(exerciseData);
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create exercise');
    }
  }
);

export const updateExercise = createAsyncThunk(
  'exercises/update',
  async ({ id, data }: { id: string; data: Partial<Exercise> }, { rejectWithValue }) => {
    try {
      const exercise = await exerciseService.updateExercise(id, data);
      return exercise;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update exercise');
    }
  }
);

export const deleteExercise = createAsyncThunk(
  'exercises/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await exerciseService.deleteExercise(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete exercise');
    }
  }
);

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    clearSelectedExercise: (state) => {
      state.selectedExercise = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all exercises
      .addCase(fetchExercises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExercises.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = action.payload.exercises;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExercises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch exercise by ID
      .addCase(fetchExerciseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExerciseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedExercise = action.payload;
      })
      .addCase(fetchExerciseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create exercise
      .addCase(createExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises.push(action.payload);
      })
      .addCase(createExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update exercise
      .addCase(updateExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateExercise.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.exercises.findIndex(ex => ex.id === action.payload.id);
        if (index !== -1) {
          state.exercises[index] = action.payload;
        }
        if (state.selectedExercise?.id === action.payload.id) {
          state.selectedExercise = action.payload;
        }
      })
      .addCase(updateExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete exercise
      .addCase(deleteExercise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExercise.fulfilled, (state, action) => {
        state.loading = false;
        state.exercises = state.exercises.filter(ex => ex.id !== action.payload);
        if (state.selectedExercise?.id === action.payload) {
          state.selectedExercise = null;
        }
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedExercise, clearError } = exerciseSlice.actions;
export default exerciseSlice.reducer; 