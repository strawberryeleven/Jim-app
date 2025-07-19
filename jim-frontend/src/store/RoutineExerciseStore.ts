import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exercise } from './slices/RoutineSlice';

interface ExerciseState {
  routineTitle: string;
  routineComment: string;
  selectedExercises: Exercise[];
}

const initialState: ExerciseState = {
  routineTitle: '',
  routineComment: '',
  selectedExercises: [],
};

export const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    updateRoutineTitle: (state, action: PayloadAction<string>) => {
      state.routineTitle = action.payload;
    },
    updateRoutineComment: (state, action: PayloadAction<string>) => {
      state.routineComment = action.payload;
    },
    addExercise: (state, action: PayloadAction<Exercise>) => {
      state.selectedExercises.push(action.payload);
    },
    removeExercise: (state, action: PayloadAction<string>) => {
      state.selectedExercises = state.selectedExercises.filter(
        exercise => exercise.name !== action.payload
      );
    },
    addSetToExercise: (state, action: PayloadAction<{ name: string }>) => {
      const exercise = state.selectedExercises.find(
        ex => ex.name === action.payload.name
      );
      if (exercise) {
        exercise.sets.push({ weight: 0, reps: 0 });
      }
    },
    updateSetValue: (
      state,
      action: PayloadAction<{
        name: string;
        setIndex: number;
        field: 'weight' | 'reps';
        value: number;
      }>
    ) => {
      const { name, setIndex, field, value } = action.payload;
      const exercise = state.selectedExercises.find(ex => ex.name === name);
      if (exercise && exercise.sets[setIndex]) {
        exercise.sets[setIndex][field] = value;
      }
    },
    removeSetFromExercise: (
      state,
      action: PayloadAction<{ name: string; setIndex: number }>
    ) => {
      const { name, setIndex } = action.payload;
      const exercise = state.selectedExercises.find(ex => ex.name === name);
      if (exercise) {
        exercise.sets = exercise.sets.filter((_, i) => i !== setIndex);
      }
    },
    clearRoutine: state => {
      state.routineTitle = '';
      state.routineComment = '';
      state.selectedExercises = [];
    },
  },
});

export const {
  updateRoutineTitle,
  updateRoutineComment,
  addExercise,
  removeExercise,
  addSetToExercise,
  updateSetValue,
  removeSetFromExercise,
  clearRoutine,
} = exerciseSlice.actions;

export default exerciseSlice.reducer;