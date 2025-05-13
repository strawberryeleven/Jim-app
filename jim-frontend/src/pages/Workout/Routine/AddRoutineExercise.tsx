import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Check } from "lucide-react";
import { Input } from "@/components/forms/input";
import { Button } from "@/components/buttons/button";
import { ScrollArea } from "@/components/utilities/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/forms/select";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { addExercise } from "@/store/slices/WorkoutExercisesSlice";
import { exerciseService, Exercise } from "@/services/exerciseService";
import { useToast } from "@/components/tooltips/use-toast";

const AddRoutineExercise = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const selectedExercises = useAppSelector((state) => state.exercises.selectedExercises);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all-equipment");
  const [selectedMuscle, setSelectedMuscle] = useState("all-muscles");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [equipmentList, setEquipmentList] = useState<string[]>([]);
  const [muscleList, setMuscleList] = useState<string[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await exerciseService.getAllExercises();
        setExercises(data);
        const { equipmentList, muscleList } = exerciseService.getUniqueEquipmentAndMuscles(data);
        setEquipmentList(equipmentList);
        setMuscleList(muscleList);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch exercises');
        setLoading(false);
        toast({
          title: "Error",
          description: "Failed to load exercises. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchExercises();
  }, [toast]);

  const isExerciseSelected = (exerciseName: string) => {
    return selectedExercises.some((ex) => ex.name === exerciseName);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedEquipment("all-equipment");
    setSelectedMuscle("all-muscles");
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEquipment =
      selectedEquipment === "all-equipment" || exercise.equipment.toLowerCase() === selectedEquipment;
    const matchesMuscle =
      selectedMuscle === "all-muscles" || exercise.muscleGroup.toLowerCase() === selectedMuscle;

    return matchesSearch && matchesEquipment && matchesMuscle;
  });

  const handleAddExercise = (exercise: Exercise) => {
    if (!isExerciseSelected(exercise.name)) {
      dispatch(addExercise({
        id: exercise.id,
        name: exercise.name,
        muscle: exercise.muscleGroup.toLowerCase(),
        equipment: exercise.equipment.toLowerCase(),
        image: exercise.imageUrl,
        sets: [{ weight: '', reps: '' }],
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            className="text-white hover:text-blue-400"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <h1 className="text-xl font-semibold">Add Exercise</h1>
          <Button
            variant="ghost"
            className="text-blue-400 hover:text-blue-500"
            onClick={() => navigate("/create-routine")}
          >
            Done
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="w-full pl-9 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500"
            placeholder="Search exercise"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger className="w-full bg-gray-200 text-black border-zinc-800">
              <SelectValue placeholder="All Equipment" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-zinc-800">
              <SelectGroup>
                <SelectItem value="all-equipment">All Equipment</SelectItem>
                {equipmentList.map((equipment) => (
                  <SelectItem key={equipment} value={equipment}>
                    {equipment}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
            <SelectTrigger className="w-full bg-gray-200 text-black border-zinc-800">
              <SelectValue placeholder="All Muscles" />
            </SelectTrigger>
            <SelectContent className="bg-white text-black border-zinc-800">
              <SelectGroup>
                <SelectItem value="all-muscles">All Muscles</SelectItem>
                {muscleList.map((muscle) => (
                  <SelectItem key={muscle} value={muscle}>
                    {muscle}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-400">
            {filteredExercises.length} Exercises Found
          </h2>
          <ScrollArea className="h-[calc(100vh-240px)]">
            <div className="space-y-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center space-x-4 p-2 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={exercise.imageUrl || "/images/default.png"}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">
                      {exercise.muscleGroup} • {exercise.equipment}
                    </p>
                  </div>

                  {isExerciseSelected(exercise.name) ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Button
                      variant="ghost"
                      className="p-2 hover:bg-zinc-800 rounded-full"
                      onClick={() => handleAddExercise(exercise)}
                    >
                      <Plus className="w-6 h-6" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AddRoutineExercise;