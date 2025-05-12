import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workoutService, Workout } from '../../services/workoutService';

interface WorkoutState {
  workouts: Workout[];
  selectedWorkout: Workout | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: WorkoutState = {
  workouts: [],
  selectedWorkout: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await workoutService.getAllWorkouts(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch workouts');
    }
  }
);

export const fetchWorkoutById = createAsyncThunk(
  'workouts/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const workout = await workoutService.getWorkoutById(id);
      return workout;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch workout');
    }
  }
);

export const createWorkout = createAsyncThunk(
  'workouts/create',
  async (workoutData: Omit<Workout, 'id' | 'createdBy' | 'likes' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const workout = await workoutService.createWorkout(workoutData);
      return workout;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create workout');
    }
  }
);

export const updateWorkout = createAsyncThunk(
  'workouts/update',
  async ({ id, data }: { id: string; data: Partial<Workout> }, { rejectWithValue }) => {
    try {
      const workout = await workoutService.updateWorkout(id, data);
      return workout;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update workout');
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  'workouts/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await workoutService.deleteWorkout(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete workout');
    }
  }
);

export const likeWorkout = createAsyncThunk(
  'workouts/like',
  async (id: string, { rejectWithValue }) => {
    try {
      await workoutService.likeWorkout(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to like workout');
    }
  }
);

export const fetchUserWorkouts = createAsyncThunk(
  'workouts/fetchUserWorkouts',
  async (userId: string, { rejectWithValue }) => {
    try {
      const workouts = await workoutService.getUserWorkouts(userId);
      return workouts;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user workouts');
    }
  }
);

const workoutSlice = createSlice({
  name: 'workouts',
  initialState,
  reducers: {
    clearSelectedWorkout: (state) => {
      state.selectedWorkout = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workouts
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload.workouts;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch workout by ID
      .addCase(fetchWorkoutById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedWorkout = action.payload;
      })
      .addCase(fetchWorkoutById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create workout
      .addCase(createWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts.push(action.payload);
      })
      .addCase(createWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update workout
      .addCase(updateWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkout.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.workouts.findIndex(w => w.id === action.payload.id);
        if (index !== -1) {
          state.workouts[index] = action.payload;
        }
        if (state.selectedWorkout?.id === action.payload.id) {
          state.selectedWorkout = action.payload;
        }
      })
      .addCase(updateWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete workout
      .addCase(deleteWorkout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = state.workouts.filter(w => w.id !== action.payload);
        if (state.selectedWorkout?.id === action.payload) {
          state.selectedWorkout = null;
        }
      })
      .addCase(deleteWorkout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Like workout
      .addCase(likeWorkout.fulfilled, (state, action) => {
        const workout = state.workouts.find(w => w.id === action.payload);
        if (workout) {
          workout.likes.push(action.payload);
        }
        if (state.selectedWorkout?.id === action.payload) {
          state.selectedWorkout.likes.push(action.payload);
        }
      })
      // Fetch user workouts
      .addCase(fetchUserWorkouts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload;
      })
      .addCase(fetchUserWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedWorkout, clearError } = workoutSlice.actions;
export default workoutSlice.reducer; 