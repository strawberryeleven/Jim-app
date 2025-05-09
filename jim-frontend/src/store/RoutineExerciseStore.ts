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
    routineTitle: string;
    routineComment: string;
    addExercise: (
      exercise: Omit<ExerciseType, "sets">,
      remove?: boolean
    ) => void;
    removeExercise: (exerciseName: string) => void;
    addSetToExercise: (exerciseIndex: number) => void;
    removeSetFromExercise: (exerciseName: string, setId: number) => void;
    updateSetValue: (
      exerciseIndex: number,
      setIndex: number,
      field: "kg" | "reps",
      value: number
    ) => void;
    updateRoutineTitle: (title: string) => void;
    updateRoutineComment: (comment: string) => void;
    clearRoutine: () => void;
  }

  export const useExerciseStore = create<ExerciseState>()(
    persist(
      (set) => ({
        selectedExercises: [],
        routineTitle: "",
        routineComment: "",

        addExercise: (exercise, remove = false) =>
          set((state) => {
            const exerciseExists = state.selectedExercises.some(
              (ex) => ex.name === exercise.name
            );

            if (remove) {
              if (exerciseExists) {
                return {
                  selectedExercises: state.selectedExercises.filter(
                    (ex) => ex.name !== exercise.name
                  ),
                };
              }
              return state;
            }

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

      removeSetFromExercise: (exerciseName, setId) =>
        set((state) => {
          const updated = state.selectedExercises.map((ex) => {
            if (ex.name === exerciseName) {
              return {
                ...ex,
                sets: ex.sets.filter((_, i) => i !== setId),
              };
            }
            return ex;
          });
          return { selectedExercises: updated };
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

      updateRoutineTitle: (title) => set({ routineTitle: title }),

      updateRoutineComment: (comment) => set({ routineComment: comment }),

      clearRoutine: () =>
        set({
          selectedExercises: [],
          routineTitle: "",
          routineComment: "",
        }),
    }),
    {
      name: "workout",
    }
  )
);
