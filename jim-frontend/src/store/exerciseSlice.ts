// store/exerciseSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Set {
  weight: string;
  reps: string;
}

interface Exercise {
  name: string;
  muscle: string;
  equipment: string;
  image?: string;
  sets: Set[];
}

interface ExerciseState {
  selectedExercises: Exercise[];
}

const initialState: ExerciseState = {
  selectedExercises: [],
};

const exerciseSlice = createSlice({
  name: "exercises",
  initialState,
  reducers: {
    addExercise: (state, action: PayloadAction<Exercise>) => {
      const exists = state.selectedExercises.some(
        (ex) => ex.name === action.payload.name
      );
      if (!exists) {
        state.selectedExercises.push(action.payload);
      }
    },
    // (optional) removeExercise, updateSet, etc.
  },
});

export const { addExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;
