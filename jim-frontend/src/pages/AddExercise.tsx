import { useState } from "react";
import { Search, Plus, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { exercises, equipmentList, muscleList } from "@/utils/exercise-data";
import { useExerciseStore } from "@/utils/exercise-store";
import { useNavigate } from "react-router-dom";

const AddExercise = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<string>("all-equipment");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("all-muscles");
  const { selectedExercises, addExercise } = useExerciseStore();

  // When equipment is selected, reset muscle selection and vice versa
  const handleEquipmentChange = (value: string) => {
    setSelectedEquipment(value);
    setSelectedMuscle("all-muscles");
  };

  const handleMuscleChange = (value: string) => {
    setSelectedMuscle(value);
    setSelectedEquipment("all-equipment");
  };

  const handleAddExercise = (exercise: typeof exercises[0]) => {
    addExercise(exercise);
    toast({
      title: "Exercise added",
      description: `${exercise.name} has been added to your workout`,
    });
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    
    // If equipment filter is active
    if (selectedEquipment !== "all-equipment") {
      return matchesSearch && exercise.equipment === selectedEquipment;
    }
    
    // If muscle filter is active
    if (selectedMuscle !== "all-muscles") {
      return matchesSearch && exercise.muscle === selectedMuscle;
    }
    
    // If no filters are active, just filter by search
    return matchesSearch;
  });

  const isExerciseSelected = (exerciseName: string) => {
    return selectedExercises.some((ex) => ex.name === exerciseName);
  };

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
            onClick={() => navigate(-1)}
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedEquipment} onValueChange={handleEquipmentChange}>
            <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="All Equipment" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
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

          <Select value={selectedMuscle} onValueChange={handleMuscleChange}>
            <SelectTrigger className="w-full bg-zinc-900 border-zinc-800 text-white">
              <SelectValue placeholder="All Muscles" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
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
                  key={exercise.name}
                  className="flex items-center space-x-4 p-2 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <div className="w-12 h-12 bg-zinc-800 rounded-full overflow-hidden">
                    <img
                      src={exercise.image}
                      alt={exercise.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{exercise.name}</h3>
                    <p className="text-sm text-gray-400">
                      {exercise.muscle} • {exercise.equipment}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="p-2 hover:bg-zinc-800 rounded-full"
                    onClick={() => handleAddExercise(exercise)}
                    disabled={isExerciseSelected(exercise.name)}
                  >
                    {isExerciseSelected(exercise.name) ? (
                      <Check className="w-6 h-6 text-green-500" />
                    ) : (
                      <Plus className="w-6 h-6" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AddExercise;
