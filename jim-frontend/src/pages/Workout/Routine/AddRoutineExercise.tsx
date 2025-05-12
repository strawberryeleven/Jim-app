import { useState } from "react";
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
import { exercises, equipmentList, muscleList } from "@/data/RoutineExerciseData";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { addExercise } from "@/store/slices/WorkoutExercisesSlice";

const AddRoutineExercise = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedExercises = useAppSelector((state) => state.exercises.selectedExercises);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("all-equipment");
  const [selectedMuscle, setSelectedMuscle] = useState("all-muscles");

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
      selectedEquipment === "all-equipment" || exercise.equipment === selectedEquipment;
    const matchesMuscle =
      selectedMuscle === "all-muscles" || exercise.muscle === selectedMuscle;

    return matchesSearch && matchesEquipment && matchesMuscle;
  });

  const handleAddExercise = (exercise: typeof exercises[0]) => {
    if (!isExerciseSelected(exercise.name)) {
      dispatch(addExercise({
        ...exercise,
        sets: [{ weight: '', reps: '' }],
      }));
    }
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

        <div className="grid grid-cols-2 gap-2">
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
                  key={exercise.name}
                  className="flex items-center space-x-4 p-2 hover:bg-zinc-900 rounded-lg transition-colors"
                >
                  <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                    <img
                      src={exercise.image || "/images/default.png"}
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