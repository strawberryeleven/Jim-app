import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/cards/card";
import { ArrowLeft } from "lucide-react";
import { routineData } from "@/data/RoutineData";
  
const RoutineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const numericId = Number(id);
const routine = routineData[numericId as keyof typeof routineData];

  if (!routine) {
    return (
      <div className="p-4 text-center text-red-500 text-xl">
        Routine not found.
      </div>
    );
  }

  return (
    <div className="p-4 text-white space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back</span>
      </button>

      {/* Routine Title */}
      <h1 className="text-3xl font-bold text-center">{routine.name}</h1>

      {/* Workout Plan */}
      <div>
        <h2 className="text-2xl font-semibold mb-3">Workout Plan</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {routine.workouts.map((exercise, index) => (
            <Card key={index} className="bg-slate-800 p-4 rounded-xl shadow-md">
              <img
                src={exercise.image}
                alt={exercise.name}
                className="w-full h-48 object-contain mb-3 rounded"
              />
              <h3 className="text-lg font-bold">{exercise.name}</h3>
              <p className="text-slate-300">{exercise.sets}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Diet Plan */}
      <div>
        <h2 className="text-2xl font-semibold mt-8 mb-3">Diet Plan</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-200">
          {routine.diet.map((meal, index) => (
            <li key={index}>{meal}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoutineDetails;