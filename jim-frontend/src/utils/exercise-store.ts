
import { create } from 'zustand';

type Exercise = {
  name: string;
  muscle: string;
  equipment: string;
  image: string;
};

type ExerciseStore = {
  selectedExercises: Exercise[];
  addExercise: (exercise: Exercise) => void;
};

export const useExerciseStore = create<ExerciseStore>((set) => ({
  selectedExercises: [],
  addExercise: (exercise) =>
    set((state) => ({
      selectedExercises: [...state.selectedExercises, exercise],
    })),
}));
