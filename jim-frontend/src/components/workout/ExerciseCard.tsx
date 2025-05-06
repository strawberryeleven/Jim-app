import React from "react";
import { Button } from "@/components/ui/buttons/button";
import { PlusIcon, X } from "lucide-react";
import ExerciseSet from "./ExerciseSet";

interface ExerciseCardProps {
  exercise: {
    name: string;
    muscle: string;
    equipment: string;
    image: string;
    sets: Array<{
      kg: number;
      reps: number;
      included: boolean;
    }>;
  };
  index: number;
  addSetToExercise: (exerciseIndex: number) => void;
  updateSetValue: (
    exerciseIndex: number,
    setIndex: number,
    field: "kg" | "reps",
    value: number
  ) => void;
  toggleSetInclusion: (exerciseIndex: number, setIndex: number) => void;
  removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void; // ✅ Add this line
  removeExercise: (exerciseName: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  index,
  addSetToExercise,
  updateSetValue,
  toggleSetInclusion,
  removeSetFromExercise, // ✅ Add this here
  removeExercise,
}) => {
  return (
    <div className="bg-zinc-800 p-4 rounded-xl mb-6 text-white">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-zinc-700 rounded-lg overflow-hidden mr-3">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-red-900/20"
          onClick={() => removeExercise(exercise.name)}
        >
          <X className="h-4 w-4 text-red-500" />
        </Button>
      </div>

      {exercise.sets.map((set, setIndex) => (
        <ExerciseSet
          key={setIndex}
          exerciseIndex={index}
          setIndex={setIndex}
          set={set}
          updateSetValue={updateSetValue}
          toggleSetInclusion={toggleSetInclusion}
          removeSetFromExercise={removeSetFromExercise} // ✅ Pass it here
        />
      ))}

      <Button
        className="w-full mt-2 bg-zinc-700 hover:bg-zinc-600 text-white"
        onClick={() => addSetToExercise(index)}
        size="sm"
      >
        <PlusIcon className="mr-2 h-4 w-4" /> Add Set
      </Button>
    </div>
  );
};

export default ExerciseCard;
