import { create } from "zustand";

export type SetType = {
  kg: number;
  reps: number;
};

export type ExerciseType = {
  id: string;
  name: string;
  image?: string;
  sets: SetType[];
};

export type WorkoutType = {
  title: string;
  duration: number; // in seconds
  isPrivate: boolean;
  exercises: ExerciseType[];
};

interface WorkoutStore {
  workout: WorkoutType;
  setWorkout: (data: Partial<WorkoutType>) => void;
  addExercise: (exercise: ExerciseType) => void;
  updateExercise: (id: string, sets: SetType[]) => void;
  removeExercise: (id: string) => void;
  resetWorkout: () => void;
}

export const useWorkoutStore = create<WorkoutStore>((set) => ({
  workout: {
    title: "",
    duration: 0,
    isPrivate: false,
    exercises: [],
  },
  setWorkout: (data) =>
    set((state) => ({
      workout: { ...state.workout, ...data },
    })),
  addExercise: (exercise) =>
    set((state) => ({
      workout: {
        ...state.workout,
        exercises: [...state.workout.exercises, exercise],
      },
    })),
  updateExercise: (id, sets) =>
    set((state) => ({
      workout: {
        ...state.workout,
        exercises: state.workout.exercises.map((ex) =>
          ex.id === id ? { ...ex, sets } : ex
        ),
      },
    })),
  removeExercise: (id) =>
    set((state) => ({
      workout: {
        ...state.workout,
        exercises: state.workout.exercises.filter((ex) => ex.id !== id),
      },
    })),
  resetWorkout: () =>
    set(() => ({
      workout: {
        title: "",
        duration: 0,
        isPrivate: false,
        exercises: [],
      },
    })),
}));
