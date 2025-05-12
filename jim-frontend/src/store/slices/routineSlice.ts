import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { routineService, Routine } from '../../services/routineService';

interface RoutineState {
  routines: Routine[];
  selectedRoutine: Routine | null;
  loading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const initialState: RoutineState = {
  routines: [],
  selectedRoutine: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
  },
};

export const fetchRoutines = createAsyncThunk(
  'routines/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await routineService.getAllRoutines(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch routines');
    }
  }
);

export const fetchRoutineById = createAsyncThunk(
  'routines/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const routine = await routineService.getRoutineById(id);
      return routine;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch routine');
    }
  }
);

export const createRoutine = createAsyncThunk(
  'routines/create',
  async (routineData: Omit<Routine, 'id' | 'createdBy' | 'likes' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const routine = await routineService.createRoutine(routineData);
      return routine;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create routine');
    }
  }
);

export const updateRoutine = createAsyncThunk(
  'routines/update',
  async ({ id, data }: { id: string; data: Partial<Routine> }, { rejectWithValue }) => {
    try {
      const routine = await routineService.updateRoutine(id, data);
      return routine;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update routine');
    }
  }
);

export const deleteRoutine = createAsyncThunk(
  'routines/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await routineService.deleteRoutine(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete routine');
    }
  }
);

export const likeRoutine = createAsyncThunk(
  'routines/like',
  async (id: string, { rejectWithValue }) => {
    try {
      await routineService.likeRoutine(id);
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to like routine');
    }
  }
);

export const fetchUserRoutines = createAsyncThunk(
  'routines/fetchUserRoutines',
  async (userId: string, { rejectWithValue }) => {
    try {
      const routines = await routineService.getUserRoutines(userId);
      return routines;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch user routines');
    }
  }
);

const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    clearSelectedRoutine: (state) => {
      state.selectedRoutine = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all routines
      .addCase(fetchRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = action.payload.routines;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch routine by ID
      .addCase(fetchRoutineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutineById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedRoutine = action.payload;
      })
      .addCase(fetchRoutineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create routine
      .addCase(createRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.routines.push(action.payload);
      })
      .addCase(createRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update routine
      .addCase(updateRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoutine.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.routines.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.routines[index] = action.payload;
        }
        if (state.selectedRoutine?.id === action.payload.id) {
          state.selectedRoutine = action.payload;
        }
      })
      .addCase(updateRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete routine
      .addCase(deleteRoutine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = state.routines.filter(r => r.id !== action.payload);
        if (state.selectedRoutine?.id === action.payload) {
          state.selectedRoutine = null;
        }
      })
      .addCase(deleteRoutine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Like routine
      .addCase(likeRoutine.fulfilled, (state, action) => {
        const routine = state.routines.find(r => r.id === action.payload);
        if (routine) {
          routine.likes.push(action.payload);
        }
        if (state.selectedRoutine?.id === action.payload) {
          state.selectedRoutine.likes.push(action.payload);
        }
      })
      // Fetch user routines
      .addCase(fetchUserRoutines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserRoutines.fulfilled, (state, action) => {
        state.loading = false;
        state.routines = action.payload;
      })
      .addCase(fetchUserRoutines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedRoutine, clearError } = routineSlice.actions;
export default routineSlice.reducer; 