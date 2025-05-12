import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Input } from "@/components/forms/input";
import { Textarea } from "@/components/forms/textarea";
import { Plus } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import { updateRoutine } from "@/store/slices/RoutineSlice";
import {
  updateRoutineTitle,
  updateRoutineComment,
  addSetToExercise,
  updateSetValue,
  removeSetFromExercise,
  removeExercise,
  clearRoutine,
} from "@/store/RoutineExerciseStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/dialogs/alert-dialog";

import ExerciseCard2 from "@/components/workout/ExerciseCard2";

const EditRoutine = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const routines = useAppSelector((state) => state.routines.routines);
  const routineTitle = useAppSelector((state) => state.exercises.routineTitle);
  const routineComment = useAppSelector((state) => state.exercises.routineComment);
  const selectedExercises = useAppSelector((state) => state.exercises.selectedExercises);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMissingTitleDialog, setShowMissingTitleDialog] = useState(false);
  const [routineNotFound, setRoutineNotFound] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  useEffect(() => {
    if (id) {
      const routine = routines.find((r) => r.id === id);

      if (routine) {
        dispatch(clearRoutine());
        dispatch(updateRoutineTitle(routine.title));
        dispatch(updateRoutineComment(routine.comment || ""));

        routine.exercises.forEach((exercise) => {
          dispatch({
            type: "exercises/addExercise",
            payload: {
              name: exercise.name,
              sets: [...exercise.sets],
              image: exercise.image || "",
            },
          });
        });
      } else {
        setRoutineNotFound(true);
      }
    }
  }, [id, routines, dispatch]);

  const addSelectedExercises = () => {
    navigate("/add-exercise");
  };

  const handleSave = () => {
    const trimmedTitle = routineTitle.trim();
    if (!trimmedTitle || selectedExercises.length === 0) {
      setShowMissingTitleDialog(true);
      return;
    }

    if (id) {
      const updatedRoutine = {
        id,
        title: trimmedTitle,
        comment: routineComment,
        exercises: selectedExercises,
        createdAt: routines.find((r) => r.id === id)?.createdAt || Date.now(),
      };

      dispatch(updateRoutine(updatedRoutine));
      setShowUpdateDialog(true); // Show confirmation dialog
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmDiscard = () => {
    dispatch(clearRoutine());
    setShowCancelDialog(false);
    navigate("/workout");
  };

  if (routineNotFound) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Routine Not Found</h2>
        <p className="text-gray-400 mb-6">
          The routine you're trying to edit doesn't exist.
        </p>
        <Button
          onClick={() => navigate("/workout")}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Back to Workouts
        </Button>
      </div>
    );
  }

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
        <h1 className="text-xl font-medium">Edit Routine</h1>
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
          onChange={(e) => dispatch(updateRoutineTitle(e.target.value))}
          className="bg-transparent border-b border-gray-700 rounded-none px-0 text-xl font-medium focus-visible:ring-0 focus-visible:border-gray-500"
        />
      </div>

      {/* Routine comment input */}
      <div className="p-4">
        <Textarea
          placeholder="Add comments about your routine (optional)"
          value={routineComment}
          onChange={(e) => dispatch(updateRoutineComment(e.target.value))}
          className="bg-transparent border-b border-gray-700 rounded-none px-0 text-lg focus-visible:ring-0 focus-visible:border-gray-500"
        />
      </div>

      {/* Exercises list */}
      <div className="px-4 mt-4 space-y-8">
        {selectedExercises.length > 0 ? (
          selectedExercises.map((exercise, index) => (
            <ExerciseCard2
              key={exercise.name}
              exercise={exercise}
              index={index}
              addSetToExercise={(arg) => dispatch(addSetToExercise(arg))}
              updateSetValue={(arg) => dispatch(updateSetValue(arg))}
              removeSetFromExercise={(_, setIndex) =>
                dispatch(removeSetFromExercise({ name: exercise.name, setIndex }))
              }
              removeExercise={(name) => dispatch(removeExercise(name))}
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

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to discard your changes? All modifications will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="bg-transparent border-2 border-gray-600 text-white hover:bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDiscard}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Missing Title Warning Dialog */}
      <AlertDialog open={showMissingTitleDialog} onOpenChange={setShowMissingTitleDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Missing Title</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Please give your routine a title and add at least one exercise before saving.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => setShowMissingTitleDialog(false)}
            >
              Got it!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Routine Updated Dialog */}
      <AlertDialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <AlertDialogContent className="bg-zinc-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Routine Updated</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Your routine has been successfully updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogAction
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                dispatch(clearRoutine());
                setShowUpdateDialog(false);
                navigate("/workout");
              }}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditRoutine;
