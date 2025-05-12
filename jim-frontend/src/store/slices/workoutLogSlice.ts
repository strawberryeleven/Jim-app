import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workoutLogService, WorkoutLog, WorkoutStats } from '../../services/workoutLogService';

interface WorkoutLogState {
  logs: WorkoutLog[];
  selectedLog: WorkoutLog | null;
  stats: WorkoutStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: WorkoutLogState = {
  logs: [],
  selectedLog: null,
  stats: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchWorkoutLogs = createAsyncThunk(
  'workoutLogs/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await workoutLogService.getAllWorkoutLogs(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch workout logs');
    }
  }
);

export const fetchWorkoutLogById = createAsyncThunk(
  'workoutLogs/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const log = await workoutLogService.getWorkoutLogById(id);
      return log;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch workout log');
    }
  }
);

export const createWorkoutLog = createAsyncThunk(
  'workoutLogs/create',
  async (logData: Omit<WorkoutLog, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const log = await workoutLogService.createWorkoutLog(logData);
      return log;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create workout log');
    }
  }
);

export const updateWorkoutLog = createAsyncThunk(
  'workoutLogs/update',
  async ({ id, data }: { id: string; data: Partial<WorkoutLog> }, { rejectWithValue }) => {
    try {
      const log = await workoutLogService.updateWorkoutLog(id, data);
      return log;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update workout log');
    }
  }
);

export const deleteWorkoutLog = createAsyncThunk(
  'workoutLogs/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await workoutLogService.deleteWorkoutLog(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete workout log');
    }
  }
);

export const fetchUserWorkoutLogs = createAsyncThunk(
  'workoutLogs/fetchUserLogs',
  async (userId: string, { rejectWithValue }) => {
    try {
      const logs = await workoutLogService.getUserWorkoutLogs(userId);
      return logs;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user workout logs');
    }
  }
);

export const fetchWorkoutStats = createAsyncThunk(
  'workoutLogs/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const stats = await workoutLogService.getWorkoutStats();
      return stats;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch workout stats');
    }
  }
);

const workoutLogSlice = createSlice({
  name: 'workoutLogs',
  initialState,
  reducers: {
    clearSelectedLog: (state) => {
      state.selectedLog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all workout logs
      .addCase(fetchWorkoutLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload.logs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchWorkoutLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch workout log by ID
      .addCase(fetchWorkoutLogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutLogById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLog = action.payload;
      })
      .addCase(fetchWorkoutLogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create workout log
      .addCase(createWorkoutLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkoutLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs.push(action.payload);
      })
      .addCase(createWorkoutLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update workout log
      .addCase(updateWorkoutLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkoutLog.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.logs.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.logs[index] = action.payload;
        }
        if (state.selectedLog?.id === action.payload.id) {
          state.selectedLog = action.payload;
        }
      })
      .addCase(updateWorkoutLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete workout log
      .addCase(deleteWorkoutLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkoutLog.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = state.logs.filter(l => l.id !== action.payload);
        if (state.selectedLog?.id === action.payload) {
          state.selectedLog = null;
        }
      })
      .addCase(deleteWorkoutLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user workout logs
      .addCase(fetchUserWorkoutLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserWorkoutLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchUserWorkoutLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch workout stats
      .addCase(fetchWorkoutStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchWorkoutStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedLog, clearError } = workoutLogSlice.actions;
export default workoutLogSlice.reducer; 