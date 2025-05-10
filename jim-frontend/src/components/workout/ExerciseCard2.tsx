import { Button } from "@/components/buttons/button";
import { Trash2, Plus } from "lucide-react";
import React from "react";

interface Set {
  weight: number;
  reps: number;
  isCompleted?: boolean;
}

interface Exercise {
  name: string;
  sets: Set[];
  image?: string; // <-- Added image field
}

interface ExerciseCard2Props {
  exercise: Exercise;
  index: number;
  addSetToExercise: (arg: { name: string }) => void;
  updateSetValue: (arg: {
    name: string;
    setIndex: number;
    field: "weight" | "reps";
    value: number;
  }) => void;
  removeSetFromExercise: (exerciseIndex: number, setIndex: number) => void;
  removeExercise: (name: string) => void;
}

const ExerciseCard2: React.FC<ExerciseCard2Props> = ({
  exercise,
  index,
  addSetToExercise,
  updateSetValue,
  removeSetFromExercise,
  removeExercise,
}) => {
  return (
    <div className="bg-zinc-900 rounded-lg p-4">
      {/* Header with image and title */}
      <div className="flex items-start gap-4 mb-4">
        {exercise.image && (
          <div className="w-20 h-20 bg-zinc-800 rounded-md overflow-hidden">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="flex-1 flex justify-between items-start">
          <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeExercise(exercise.name)}
            className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-transparent"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {/* Table headers */}
      <div className="mb-3 grid grid-cols-12 gap-2 text-sm text-gray-400">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Weight (kg)</div>
        <div className="col-span-5">Reps</div>
        <div className="col-span-1" />
      </div>

      {/* Set list */}
      {exercise.sets.map((set, setIndex) => (
        <div key={setIndex} className="mb-3 grid grid-cols-12 gap-2 items-center">
          <div className="col-span-1 text-gray-400">{setIndex + 1}</div>
          <div className="col-span-5">
            <input
              type="number"
              value={set.weight}
              onChange={(e) =>
                updateSetValue({
                  name: exercise.name,
                  setIndex,
                  field: "weight",
                  value: Number(e.target.value),
                })
              }
              className="w-full bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700"
            />
          </div>
          <div className="col-span-5">
            <input
              type="number"
              value={set.reps}
              onChange={(e) =>
                updateSetValue({
                  name: exercise.name,
                  setIndex,
                  field: "reps",
                  value: Number(e.target.value),
                })
              }
              className="w-full bg-zinc-800 text-white px-2 py-1 rounded border border-zinc-700"
            />
          </div>
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSetFromExercise(index, setIndex)}
              className="h-6 w-6 text-gray-400 hover:text-red-500 hover:bg-transparent"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}

      {/* Add Set Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addSetToExercise({ name: exercise.name })}
        className="mt-2 w-full text-blue-400 border-dashed border-blue-400/30 hover:border-blue-400/50 hover:bg-blue-400/5"
      >
        <Plus size={16} className="mr-1" /> Add Set
      </Button>
    </div>
  );
};

export default ExerciseCard2;
