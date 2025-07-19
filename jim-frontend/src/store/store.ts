import { configureStore } from '@reduxjs/toolkit';
import routineReducer from './slices/RoutineSlice';
import exerciseReducer from './RoutineExerciseStore';
import profileReducer from './slices/profileSlice';
import workoutLogReducer from './slices/WorkoutLogSlice';

export const store = configureStore({
  reducer: {
    routines: routineReducer,
    exercises: exerciseReducer,
    profile: profileReducer,
    workoutLogs: workoutLogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;