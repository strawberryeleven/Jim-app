import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { workoutLogService } from "@/services/workoutLogService";

// Types
export interface ExerciseSummary {
  name: string;
  sets: number;
  image: string;
  weight?: number;
  reps?: number;
  muscle?: string;
}

export interface WorkoutLog {
  id: string;
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic: boolean;
  notes?: string;
  exercises: ExerciseSummary[];
  totalSets: number;
  duration: number;
  muscleGroups: {
    [key: string]: number; // muscle group name -> total volume
  };
}

interface WorkoutLogsState {
  logs: Record<string, WorkoutLog[]>;
  selectedDate: string | null;
  loading: boolean;
  error: string | null;
}

// Initial data
const initialData: Record<string, WorkoutLog[]> = {
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

const initialState: WorkoutLogsState = {
  logs: initialData,
  selectedDate: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchWorkoutLogs = createAsyncThunk(
  "workoutLogs/fetchWorkoutLogs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutLogService.getWorkoutLogs();
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to fetch workout logs");
    }
  }
);

export const addWorkoutLog = createAsyncThunk(
  "workoutLogs/addWorkoutLog",
  async (log: WorkoutLog, { rejectWithValue }) => {
    try {
      const response = await workoutLogService.addWorkoutLog(log);
      return response.data;
    } catch (error) {
      return rejectWithValue("Failed to add workout log");
    }
  }
);

// Slice
const workoutLogSlice = createSlice({
  name: "workoutLogs",
  initialState,
  reducers: {
    setSelectedDate: (state, action: PayloadAction<string | null>) => {
      state.selectedDate = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Workout Logs
      .addCase(fetchWorkoutLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchWorkoutLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Workout Log
      .addCase(addWorkoutLog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorkoutLog.fulfilled, (state, action) => {
        state.loading = false;
        const log = action.payload;
        if (!state.logs[log.date]) {
          state.logs[log.date] = [];
        }
        state.logs[log.date].push(log);
      })
      .addCase(addWorkoutLog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { setSelectedDate, clearError } = workoutLogSlice.actions;
export default workoutLogSlice.reducer;
