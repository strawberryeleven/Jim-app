import React from "react";
import { Checkbox } from "@/components/ui/forms/checkbox";
import { Trash2 } from "lucide-react";

interface ExerciseSetProps {
  exerciseIndex: number;
  setIndex: number;
  set: {
    kg: number;
    reps: number;
    included: boolean;
  };
  updateSetValue: (
    exerciseIndex: number,
    setIndex: number,
    field: "kg" | "reps",
    value: number
  ) => void;
  toggleSetInclusion: (exerciseIndex: number, setIndex: number) => void;
  removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void; // New prop
}

const ExerciseSet: React.FC<ExerciseSetProps> = ({
  exerciseIndex,
  setIndex,
  set,
  updateSetValue,
  toggleSetInclusion,
  removeSetFromExercise,
}) => {
  const handleInputChange = (
    field: "kg" | "reps",
    value: number
  ) => {
    const safeValue = Math.max(0, value); // Prevent negative
    updateSetValue(exerciseIndex, setIndex, field, safeValue);
  };

  return (
    <div className="flex items-center justify-between bg-zinc-700 p-2 mb-2 rounded-lg">
      <div className="flex items-center gap-2 w-full">
        <label className="text-sm">Kg:</label>
        <input
          type="number"
          value={set.kg}
          onChange={(e) => handleInputChange("kg", Number(e.target.value))}
          className="w-16 p-1 rounded bg-zinc-600 text-white"
          min={0}
        />
        <label className="text-sm ml-4">Reps:</label>
        <input
          type="number"
          value={set.reps}
          onChange={(e) => handleInputChange("reps", Number(e.target.value))}
          className="w-16 p-1 rounded bg-zinc-600 text-white"
          min={0}
        />
        <div className="flex items-center ml-4">
          <label className="text-sm mr-2">Include:</label>
          <Checkbox
            checked={set.included}
            onCheckedChange={() => toggleSetInclusion(exerciseIndex, setIndex)}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>
      </div>

      <button
        onClick={() => removeSetFromExercise(exerciseIndex, setIndex)}
        className="ml-2 text-red-500 hover:text-red-700"
        title="Remove set"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ExerciseSet;
