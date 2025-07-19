import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/cards/card";
import { ArrowLeft } from "lucide-react";
import { routineData } from "@/data/RoutineData";
import { Button } from "@/components/buttons/button";
  
const RoutineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
  const routine = routineData[numericId as keyof typeof routineData];

  if (!routine) {
    return (
      <div className="flex flex-col min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500 text-xl">
            Routine not found.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold text-blue-500">{routine.name}</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {/* Workout Plan */}
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Workout Plan</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {routine.workouts.map((exercise, index) => (
                <Card key={index} className="bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-colors">
                  <img
                    src={exercise.image}
                    alt={exercise.name}
                    className="w-full h-48 object-contain mb-3 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold text-white">{exercise.name}</h3>
                  <p className="text-gray-400">{exercise.sets}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Diet Plan */}
          <div>
            <h2 className="text-xl font-semibold text-blue-400 mb-4">Diet Plan</h2>
            <div className="bg-zinc-900 rounded-lg p-6">
              <ul className="space-y-3 text-gray-300">
                {routine.diet.map((meal, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    {meal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineDetails;