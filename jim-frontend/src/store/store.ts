import { configureStore } from '@reduxjs/toolkit';
import routineReducer from './slices/routineSlice';
import exerciseReducer from './RoutineExerciseStore';

export const store = configureStore({
  reducer: {
    routines: routineReducer,
    exercises: exerciseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;