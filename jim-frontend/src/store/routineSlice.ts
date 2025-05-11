import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Exercise {
  name: string;
  sets: {
    weight: number;
    reps: number;
    isCompleted?: boolean;
  }[];
   image?: string;
}

export interface Routine {
  id: string;
  title: string;
  comment?: string;
  exercises: Exercise[];
  createdAt: number;
}

interface RoutineState {
  routines: Routine[];
}

const initialState: RoutineState = {
  routines: [],
};

export const routineSlice = createSlice({
  name: 'routines',
  initialState,
  reducers: {
    addRoutine: (state, action: PayloadAction<Routine>) => {
      state.routines.push(action.payload);
    },
    deleteRoutine: (state, action: PayloadAction<string>) => {
      state.routines = state.routines.filter(routine => routine.id !== action.payload);
    },
    updateRoutine: (state, action: PayloadAction<Routine>) => {
      const index = state.routines.findIndex(routine => routine.id === action.payload.id);
      if (index !== -1) {
        state.routines[index] = action.payload;
      }
    }
  },
});

export const { addRoutine, deleteRoutine, updateRoutine } = routineSlice.actions;
export default routineSlice.reducer;