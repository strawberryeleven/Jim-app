import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ExerciseSummary = {
  sets: number;
  name: string;
  image: string;
};

type WorkoutLog = {
  title: string;
  time: string;
  volume: string;
  exercises: ExerciseSummary[];
};

type WorkoutLogsState = Record<string, WorkoutLog[]>;

const initialState: WorkoutLogsState = {};

const workoutLogSlice = createSlice({
  name: "workoutLogs",
  initialState,
  reducers: {
    addWorkoutLog: (
      state,
      action: PayloadAction<{ date: string; log: WorkoutLog }>
    ) => {
      const { date, log } = action.payload;
      if (!state[date]) {
        state[date] = [];
      }
      state[date].push(log);
    },
  },
});

export const { addWorkoutLog } = workoutLogSlice.actions;
export default workoutLogSlice.reducer;
