import { create } from "zustand";
import { persist } from "zustand/middleware";

type SetType = {
  kg: number;
  reps: number;
  included: boolean;
};

type ExerciseType = {
  name: string;
  muscle: string;
  equipment: string;
  image: string;
  sets: SetType[];
};

interface ExerciseState {
  selectedExercises: ExerciseType[];
  startTime: number | null;
  setStartTime: (time: number) => void;
  resetStartTime: () => void;
  addExercise: (
    exercise: Omit<ExerciseType, "sets">,
    remove?: boolean
  ) => void;
  removeExercise: (exerciseName: string) => void;
  clearExercises: () => void;
  addSetToExercise: (exerciseIndex: number) => void;
  updateSetValue: (
    exerciseIndex: number,
    setIndex: number,
    field: "kg" | "reps",
    value: number
  ) => void;
  toggleSetInclusion: (exerciseIndex: number, setIndex: number) => void;
  updateExercise: (exerciseIndex: number, updatedExercise: ExerciseType) => void;
}

export const useExerciseStore = create<ExerciseState>()(
  persist(
    (set) => ({
      selectedExercises: [],
      startTime: null,

      setStartTime: (time) => set({ startTime: time }),
      resetStartTime: () => set({ startTime: null }),

      addExercise: (exercise, remove = false) =>
        set((state) => {
          const exerciseExists = state.selectedExercises.some(
            (ex) => ex.name === exercise.name
          );

          if (remove) {
            // Remove exercise if it exists
            if (exerciseExists) {
              return {
                selectedExercises: state.selectedExercises.filter(
                  (ex) => ex.name !== exercise.name
                ),
              };
            }
            return state;
          }

          // Add exercise if it doesn't exist
          if (!exerciseExists) {
            const newExercise: ExerciseType = {
              ...exercise,
              sets: [{ kg: 0, reps: 0, included: true }],
            };
            return {
              selectedExercises: [...state.selectedExercises, newExercise],
            };
          }

          return state;
        }),

      removeExercise: (exerciseName) =>
        set((state) => ({
          selectedExercises: state.selectedExercises.filter(
            (ex) => ex.name !== exerciseName
          ),
        })),

      clearExercises: () => set({ selectedExercises: [], startTime: null }),

      addSetToExercise: (exerciseIndex) =>
        set((state) => {
          const updatedExercises = [...state.selectedExercises];
          if (updatedExercises[exerciseIndex]) {
            updatedExercises[exerciseIndex].sets.push({
              kg: 0,
              reps: 0,
              included: true,
            });
          }
          return { selectedExercises: updatedExercises };
        }),

      updateSetValue: (exerciseIndex, setIndex, field, value) =>
        set((state) => {
          const updatedExercises = [...state.selectedExercises];
          if (
            updatedExercises[exerciseIndex] &&
            updatedExercises[exerciseIndex].sets[setIndex]
          ) {
            updatedExercises[exerciseIndex].sets[setIndex][field] = value;
          }
          return { selectedExercises: updatedExercises };
        }),

      toggleSetInclusion: (exerciseIndex, setIndex) =>
        set((state) => {
          const updatedExercises = [...state.selectedExercises];
          if (
            updatedExercises[exerciseIndex] &&
            updatedExercises[exerciseIndex].sets[setIndex]
          ) {
            const current =
              updatedExercises[exerciseIndex].sets[setIndex].included;
            updatedExercises[exerciseIndex].sets[setIndex].included = !current;
          }
          return { selectedExercises: updatedExercises };
        }),

      updateExercise: (exerciseIndex, updatedExercise) =>
        set((state) => {
          const updatedExercises = [...state.selectedExercises];
          if (updatedExercises[exerciseIndex]) {
            updatedExercises[exerciseIndex] = updatedExercise;
          }
          return { selectedExercises: updatedExercises };
        }),
    }),
    {
      name: "workout",
    }
  )
);
