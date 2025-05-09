import { Card } from "@/components/cards/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { routines } from "@/data/Routines";

const ExploreRoutines = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-white hover:text-gray-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        <span>Back</span>
      </button>

      <h1 className="text-2xl font-bold text-white mb-4">Explore Routines</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {routines.map((routine) => (
          <Card
            key={routine.id}
            onClick={() => navigate(`/routines/${routine.id}`)}
            className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
          >
            <h2 className="text-xl text-white font-semibold">{routine.name}</h2>
            <p className="text-sm text-gray-300 mt-2">{routine.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExploreRoutines;

