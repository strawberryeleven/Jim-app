import { useState } from "react";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { Textarea } from "@/components/forms/textarea";
import { useNavigate } from "react-router-dom";
import { Plus, AlertCircle } from "lucide-react";
import { useExerciseStore } from "@/store/RoutineExerciseStore";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/dialogs/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/alerts/alert-dialog";
import ExerciseCard from "@/components/workout/ExerciseCard";

const CreateRoutine = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    routineTitle,
    routineComment,
    updateRoutineTitle,
    updateRoutineComment,
    selectedExercises,
    addExercise,
    addSetToExercise,
    updateSetValue,
    removeSetFromExercise,
    removeExercise,
    clearRoutine,
  } = useExerciseStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMissingTitleDialog, setShowMissingTitleDialog] = useState(false);

  const addSelectedExercises = () => {
    navigate("/add-exercise2");
  };

  const handleSave = () => {
    const trimmedTitle = routineTitle.trim();
    if (!trimmedTitle || selectedExercises.length === 0) {
      setShowMissingTitleDialog(true);
      return;
    }

    toast({
      title: "Routine Saved",
      description: `${trimmedTitle} has been saved successfully.`,
    });

    clearRoutine();
    navigate("/routines");
  };

  const handleCancel = () => {
    if (selectedExercises.length > 0 || routineTitle.trim()) {
      setShowCancelDialog(true);
    } else {
      navigate(-1);
    }
  };

  const confirmDiscard = () => {
    clearRoutine();
    setShowCancelDialog(false);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        <Button
          variant="link"
          className="text-blue-500 p-0 h-auto text-lg"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <h1 className="text-xl font-medium">Create Routine</h1>
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      {/* Title input */}
      <div className="p-4">
        <Input
          placeholder="Routine title"
          value={routineTitle}
          onChange={(e) => updateRoutineTitle(e.target.value)}
          className="bg-transparent border-b border-gray-700 rounded-none px-0 text-xl font-medium focus-visible:ring-0 focus-visible:border-gray-500"
        />
      </div>

      {/* Routine comment input */}
      <div className="p-4">
        <Textarea
          placeholder="Add comments about your routine (optional)"
          value={routineComment}
          onChange={(e) => updateRoutineComment(e.target.value)}
          className="bg-transparent border-b border-gray-700 rounded-none px-0 text-lg focus-visible:ring-0 focus-visible:border-gray-500"
        />
      </div>

      {/* Exercises list */}
      <div className="px-4 mt-4 space-y-8">
        {selectedExercises.length > 0 ? (
          selectedExercises.map((exercise, index) => (
            <ExerciseCard
              key={exercise.name}
              exercise={exercise}
              index={index}
              addSetToExercise={addSetToExercise}
              updateSetValue={updateSetValue}
              toggleSetInclusion={() => {}}
              removeSetFromExercise={(exerciseIndex, setIndex) =>
                removeSetFromExercise(exercise.name, setIndex)
              }
              removeExercise={() => removeExercise(exercise.name)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center mt-12 px-6 text-center">
            <div className="text-gray-500 text-5xl mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6.5 6.5h11" />
                <path d="M20 15V9c0-.6-.4-1-1-1h-2a1 1 0 0 0-1 1v6c0 .6.4 1 1 1h2c.6 0 1-.4 1-1Z" />
                <path d="M4 15V9c0-.6.4-1 1-1h2c.6 0 1 .4 1 1v6c0 .6-.4 1-1 1H5c-.6 0-1-.4-1-1Z" />
                <path d="M8 9h8" />
                <path d="M8 15h8" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              Get started by adding an exercise to your routine.
            </p>
          </div>
        )}
      </div>

      {/* Add Exercise Button */}
      <div className="fixed bottom-20 left-0 right-0 px-6">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg font-medium rounded-xl"
          onClick={addSelectedExercises}
        >
          <Plus className="mr-2" size={24} /> Add exercise
        </Button>
      </div>

      {/* Cancel Confirmation */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Discard Routine?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to discard this routine? All changes will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-transparent text-white border-gray-700 hover:bg-zinc-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-red-500 hover:bg-red-600 text-white border-none"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Missing Title or Exercises Dialog */}
      <Dialog open={showMissingTitleDialog} onOpenChange={setShowMissingTitleDialog}>
        <DialogContent className="bg-zinc-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <AlertCircle className="h-6 w-6 text-yellow-500 mr-2" />
              Incomplete Routine
            </DialogTitle>
            <DialogDescription className="text-gray-300 pt-2">
              Please enter a routine title and add at least one exercise before saving.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowMissingTitleDialog(false)}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateRoutine;
