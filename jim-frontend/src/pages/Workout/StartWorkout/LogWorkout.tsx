import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { PlusIcon, ArrowLeft } from "lucide-react";
import { useExerciseStore } from "@/store/WorkpoutExerciseStore";
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white relative overflow-hidden">
      {/* Abstract Background Forms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-zinc-800/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/workout")}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-blue-400">Log Workout</h1>
          <Button
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
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

        {/* Alert Block */}
        {showAlert && (
          <div
            className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 text-red-400 px-4 py-3 rounded-lg relative mb-6"
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
              <span className="text-red-400 text-lg">&times;</span>
            </button>
          </div>
        )}

        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <WorkoutStats duration={duration} volume={volume} totalSets={totalSets} />
          </div>

          <div className="space-y-4">
            {exercises.length === 0 ? (
              <EmptyWorkout />
            ) : (
              <div className="space-y-4">
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
                  className="w-full bg-blue-500 hover:bg-blue-600 transition-colors"
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
    </div>
  );
};

export default LogWorkout;