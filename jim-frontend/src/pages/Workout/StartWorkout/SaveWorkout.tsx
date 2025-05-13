import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Camera, User, Trash, Check } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { Textarea } from "@/components/forms/textarea";
import { Input } from "@/components/forms/input";
import { useExerciseStore } from "@/store/WorkpoutExerciseStore";
import { useToast } from "@/hooks/use-toast";
import { formatDuration } from "@/utils/FormatTime";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/cards/hover-card";
import DiscardWorkoutDialog from "@/components/workout/DiscardWorkoutDialog";
import { useDispatch } from "react-redux";
import { addWorkoutLog } from "@/store/slices/WorkoutLogSlice";
import { AppDispatch } from "@/store/store";
import { workoutLogService } from "@/services/workoutLogService";

const SaveWorkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { selectedExercises, clearExercises, startTime, resetStartTime } = useExerciseStore();

  const [title, setTitle] = useState("Workout title");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<"Public" | "Private">("Public");
  const [openVisibilityPopover, setOpenVisibilityPopover] = useState(false);
  const [openDiscardDialog, setOpenDiscardDialog] = useState(false); // State to control dialog visibility
  const fileInputRef = useRef<HTMLInputElement>(null);

  const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
  const formattedDuration = formatDuration(duration);

  const calculateVolume = () => {
    return selectedExercises.reduce((total, exercise) => {
      return total + exercise.sets.reduce((subTotal, set) => {
        return subTotal + (set.included ? set.kg * set.reps : 0);
      }, 0);
    }, 0);
  };

  const calculateTotalSets = () => {
    return selectedExercises.reduce((total, exercise) => {
      return total + exercise.sets.filter(set => set.included).length;
    }, 0);
  };

  const volume = calculateVolume();
  const totalSets = calculateTotalSets();

  const handleSave = async () => {
    try {
      const now = new Date();
      
      // Calculate total volume
      const totalVolume = selectedExercises.reduce((total, exercise) => {
        return total + exercise.sets.reduce((subTotal, set) => {
          return subTotal + (set.included ? (set.kg || 0) * (set.reps || 0) : 0);
        }, 0);
      }, 0);

      // Calculate muscle groups volume
      const muscleGroupsVolume = selectedExercises.reduce((acc, exercise) => {
        if (exercise.muscle) {
          const exerciseVolume = exercise.sets.reduce((total, set) => {
            return total + (set.included ? (set.kg || 0) * (set.reps || 0) : 0);
          }, 0);
          acc[exercise.muscle] = (acc[exercise.muscle] || 0) + exerciseVolume;
        }
        return acc;
      }, {} as Record<string, number>);

      const workoutLogData = {
        title: title.trim(),
        time: now.toISOString(),
        volume: totalVolume.toString(),
        date: now.toISOString(),
        isPublic: visibility === "Public",
        notes: description.trim(),
        exercises: selectedExercises.map(exercise => ({
          name: exercise.name,
          sets: exercise.sets.filter(set => set.included).length,
          image: exercise.image || "https://example.com/default-exercise.jpg",
          weight: exercise.sets[0]?.kg || 0,
          reps: exercise.sets[0]?.reps || 0,
          muscle: exercise.muscle || "other"
        })),
        totalSets: selectedExercises.reduce((total, exercise) => 
          total + exercise.sets.filter(set => set.included).length, 0),
        duration: Math.floor(duration / 60),
        muscleGroups: muscleGroupsVolume
      };

      // Log the data being sent
      console.log('Preparing workout log data:', workoutLogData);

      // Validate data before sending
      if (!workoutLogData.title) {
        throw new Error('Please enter a workout title');
      }

      if (workoutLogData.exercises.length === 0) {
        throw new Error('Please add at least one exercise');
      }

      if (workoutLogData.totalSets === 0) {
        throw new Error('Please add at least one set');
      }

      // Save to backend
      const response = await workoutLogService.createWorkoutLog(workoutLogData);

      // Update Redux store
      dispatch(addWorkoutLog(response));

      toast({
        title: "Workout saved!",
        description: "Your workout has been successfully saved.",
      });

      clearExercises();
      resetStartTime();
      navigate("/workout");
    } catch (error) {
      console.error('Error saving workout:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save workout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoBack = () => navigate("/log-workout");

  const handleAddPhoto = () => fileInputRef.current?.click();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDiscardWorkout = () => {
    setOpenDiscardDialog(true); // Open the discard dialog
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) + ", " + now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
            onClick={handleGoBack}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back</span>
          </Button>
          <h1 className="text-2xl font-bold text-blue-400">Save Workout</h1>
          <Button
            className="bg-blue-500 hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            <Save className="w-5 h-5 mr-2" />
            Save
          </Button>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">
                  Workout Title
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  placeholder="Enter workout title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-2">
                  Notes
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700 transition-colors"
                  placeholder="Add notes about your workout"
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-4">
                <Popover open={openVisibilityPopover} onOpenChange={setOpenVisibilityPopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center space-x-2 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
                    >
                      {visibility === "Public" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Trash className="w-4 h-4" />
                      )}
                      <span>{visibility}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-zinc-900 border-zinc-800 text-white">
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                          setVisibility("Public");
                          setOpenVisibilityPopover(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Public
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-zinc-800 transition-colors"
                        onClick={() => {
                          setVisibility("Private");
                          setOpenVisibilityPopover(false);
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Private
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  variant="outline"
                  className="flex items-center space-x-2 bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
                  onClick={handleAddPhoto}
                >
                  <Camera className="w-4 h-4" />
                  <span>Add Photo</span>
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-blue-400 mb-4">Workout Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-lg font-medium text-white">{formattedDuration}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Volume</p>
                <p className="text-lg font-medium text-white">{volume} kg</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-sm text-gray-400">Total Sets</p>
                <p className="text-lg font-medium text-white">{totalSets}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-blue-400 mb-4">Exercises</h2>
            <div className="space-y-4">
              {selectedExercises.map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 bg-zinc-900/50 rounded-lg"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">
                      {exercise.sets.length} sets
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={handleDiscardWorkout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              Discard Workout
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 transition-colors"
              onClick={handleSave}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Workout
            </Button>
          </div>
        </div>
      </div>

      <DiscardWorkoutDialog
        open={openDiscardDialog}
        onOpenChange={setOpenDiscardDialog}
        clearExercises={clearExercises}
      />
    </div>
  );
};

export default SaveWorkout;
