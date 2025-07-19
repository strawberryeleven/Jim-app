import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { Textarea } from "@/components/forms/textarea";
import { useToast } from "@/components/tooltips/use-toast";
import { routineService, CreateRoutineData } from "@/services/routineService";
import { useAppSelector } from "@/hooks/redux-hooks";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const selectedExercises = useAppSelector((state) => state.exercises.selectedExercises);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return; // Prevent double submission
    }

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a routine name",
        variant: "destructive",
      });
      return;
    }

    if (selectedExercises.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one exercise to the routine",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const routineData: CreateRoutineData = {
        name: name.trim(),
        description: description.trim(),
        exercises: selectedExercises.map((exercise, index) => ({
          exerciseId: exercise.id || exercise.name,
          sets: exercise.sets.map(set => ({
            weight: Number(set.weight) || 0,
            reps: Number(set.reps) || 0,
            isCompleted: false
          })),
          order: index
        })),
        isPublic
      };

      console.log('Sending routine data:', JSON.stringify(routineData, null, 2));

      const routine = await routineService.createRoutine(routineData);

      toast({
        title: "Success",
        description: "Routine created successfully",
      });

      navigate("/routines");
    } catch (error) {
      console.error("Error creating routine:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create routine",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">Create New Routine</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-400">
                Routine Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter routine name"
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-400">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter routine description"
                className="bg-zinc-900 border-zinc-800 text-white focus:border-zinc-700 transition-colors"
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-zinc-800 bg-zinc-900 focus:ring-blue-500 focus:ring-offset-zinc-900 transition-colors"
              />
              <label htmlFor="isPublic" className="text-sm font-medium text-gray-400">
                Make this routine public
              </label>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-400">Selected Exercises</h2>
              {selectedExercises.length === 0 ? (
                <p className="text-gray-400">No exercises selected</p>
              ) : (
                <div className="space-y-4">
                  {selectedExercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="p-4 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-white">{exercise.name}</h3>
                        <span className="text-sm text-gray-400">
                          {exercise.muscleGroup} • {exercise.equipment}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex items-center space-x-4 text-sm text-gray-300"
                          >
                            <span className="text-gray-400">Set {setIndex + 1}:</span>
                            <span>Weight: {set.weight || 0} kg</span>
                            <span>Reps: {set.reps || 0}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/add-routine-exercise")}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Add Exercises
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 hover:bg-blue-600 transition-colors"
              >
                {isSubmitting ? "Creating..." : "Create Routine"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoutine;
