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
    <div className="min-h-screen bg-black text-white">
      <div className="flex justify-between items-center p-4 border-b border-zinc-800">
        <Button variant="ghost" onClick={handleGoBack} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-semibold">Save Workout</h1>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleSave}>
          <Save className="h-4 w-4 mr-1" /> Save
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none p-0 focus-visible:ring-0"
          placeholder="Workout title"
        />

        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-zinc-800">
          <div>
            <p className="text-sm text-gray-400">Duration</p>
            <p className="text-blue-500">{formattedDuration}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Volume</p>
            <p>{volume} kg</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Sets</p>
            <p>{totalSets}</p>
          </div>
        </div>

        <div className="border-b border-zinc-800 pb-4">
          <p className="text-sm text-gray-400">When</p>
          <p className="text-blue-500">{getCurrentDateTime()}</p>
        </div>

        <div className="border-b border-zinc-800 pb-4">
          <input
            type="file"
            accept="image/*"
            hidden
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            onClick={handleAddPhoto}
            className="flex items-center justify-center w-32 h-32 border border-dashed border-zinc-700 rounded-lg hover:bg-zinc-900 transition-colors"
          >
            {image ? (
              <img src={image} alt="Workout" className="h-full object-cover rounded-lg" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Camera className="h-6 w-6" />
                <span>Add a photo / video</span>
              </div>
            )}
          </button>
        </div>

        <div className="border-b border-zinc-800 pb-4">
          <p className="text-sm text-gray-400 mb-2">Description</p>
          <Textarea
            placeholder="How did your workout go? Leave some notes here..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-transparent border-none resize-none min-h-[80px] focus-visible:ring-0 p-0"
          />
        </div>

        <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
          <p>Visibility</p>
          <Popover open={openVisibilityPopover} onOpenChange={setOpenVisibilityPopover}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="text-gray-400 flex items-center gap-2">
                {visibility} <User className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-0 bg-zinc-800 text-white border-zinc-700">
              {["Public", "Private"].map((option) => (
                <HoverCard key={option}>
                  <HoverCardTrigger asChild>
                    <button
                      onClick={() => {
                        setVisibility(option as "Public" | "Private");
                        setOpenVisibilityPopover(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-700 flex justify-between items-center"
                    >
                      <span>{option}</span>
                      {visibility === option && <Check className="h-4 w-4 text-green-500" />}
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="text-sm text-gray-300 bg-zinc-900 border border-zinc-700">
                    {option === "Private"
                      ? "Only your followers can see this workout."
                      : "Everyone can see this workout."}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </PopoverContent>
          </Popover>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-transparent"
          onClick={handleDiscardWorkout}
        >
          <Trash className="h-4 w-4 mr-2" /> Discard Workout
        </Button>
      </div>

      {/* Discard Workout Dialog */}
      <DiscardWorkoutDialog
        open={openDiscardDialog}
        onOpenChange={setOpenDiscardDialog}
        clearExercises={clearExercises}
      />
    </div>
  );
};

export default SaveWorkout;
