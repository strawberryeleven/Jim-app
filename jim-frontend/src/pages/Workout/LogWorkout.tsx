import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { PlusIcon, ArrowLeft } from "lucide-react";
import { useExerciseStore } from "@/store/ExerciseStore";
import WorkoutStats from "@/components/workout/WorkoutStats";
import EmptyWorkout from "@/components/workout/EmptyWorkout";
import ExerciseCard from "@/components/workout/ExerciseCard";
import WorkoutActions from "@/components/workout/WorkoutActions";
import DiscardWorkoutDialog from "@/components/workout/DiscardWorkoutDialog";

const LogWorkout = () => {
  const navigate = useNavigate();
  const [duration, setDuration] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const {
    selectedExercises: exercises,
    clearExercises,
    removeExercise,
    addSetToExercise,
    updateSetValue,
    toggleSetInclusion,
    updateExercise,
    startTime,
    setStartTime,
    resetStartTime,
  } = useExerciseStore();

  const [volume, setVolume] = useState(0);
  const [totalSets, setTotalSets] = useState(0);

  useEffect(() => {
    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      setDuration(0);
    } else {
      const initialElapsed = Math.floor((Date.now() - startTime) / 1000);
      setDuration(initialElapsed);
    }

    const interval = setInterval(() => {
      if (startTime) {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        setDuration(elapsedSeconds);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, setStartTime]);

  useEffect(() => {
    updateStats();
  }, [exercises]);

  const updateStats = () => {
    let totalKg = 0;
    let sets = 0;
    exercises.forEach((exercise) =>
      exercise.sets.forEach((set) => {
        if (set.included) {
          totalKg += set.kg * set.reps;
          sets += 1;
        }
      })
    );
    setVolume(totalKg);
    setTotalSets(sets);
  };

  const removeSetFromExercise = (exerciseIndex: number, setIndex: number) => {
    const updatedExercise = {
      ...exercises[exerciseIndex],
      sets: exercises[exerciseIndex].sets.filter((_, i) => i !== setIndex),
    };
    updateExercise(exerciseIndex, updatedExercise);
  };

  const hasValidExercises = () => {
    return exercises.every(exercise =>
      exercise.sets.every(set => set.kg > 0 && set.reps > 0 && set.included)
    );
  };

  return (
    <div className="min-h-screen text-white">
      <div className="p-4 space-y-6">
        {/* ✅ Back Button (non-destructive) */}
        <button
          onClick={() => navigate("/workout")}
          className="flex items-center text-white hover:text-gray-300 transition-colors mb-2"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>

        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Log Workout</h1>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              if (exercises.length === 0 || !hasValidExercises()) {
                setShowAlert(true);
                return;
              }
              navigate("/save-workout");
            }}
          >
            Finish
          </Button>
        </div>

        {/* ✅ Alert Block */}
        {showAlert && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Hold on!</strong>
            <span className="block sm:inline ml-2">
              Please ensure that all exercises have non-zero weight and reps before finishing the workout.
            </span>
            <button
              onClick={() => setShowAlert(false)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-red-700 text-lg">&times;</span>
            </button>
          </div>
        )}

        <WorkoutStats duration={duration} volume={volume} totalSets={totalSets} />

        <div className="mt-4">
          {exercises.length === 0 ? (
            <EmptyWorkout />
          ) : (
            <div>
              {exercises.map((exercise, i) => (
                <ExerciseCard
                  key={i}
                  exercise={exercise}
                  index={i}
                  addSetToExercise={addSetToExercise}
                  updateSetValue={updateSetValue}
                  toggleSetInclusion={toggleSetInclusion}
                  removeExercise={removeExercise}
                  removeSetFromExercise={removeSetFromExercise}
                />
              ))}

              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700 mb-6"
                onClick={() => navigate("/add-exercise")}
              >
                <PlusIcon className="mr-2" /> Add Exercise
              </Button>
            </div>
          )}
        </div>

        <WorkoutActions onOpenDiscardDialog={() => setOpenDialog(true)} />

        <DiscardWorkoutDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          clearExercises={clearExercises}
        />
      </div>
    </div>
  );
};

export default LogWorkout;