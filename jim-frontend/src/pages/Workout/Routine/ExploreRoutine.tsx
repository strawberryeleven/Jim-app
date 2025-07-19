import { Card } from "@/components/cards/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { routines } from "@/data/Routines";
import { Button } from "@/components/buttons/button";

const ExploreRoutines = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold text-blue-500">Explore Routines</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>

        <div className="max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {routines.map((routine) => (
              <Card
                key={routine.id}
                onClick={() => navigate(`/routines/${routine.id}`)}
                className="p-6 bg-zinc-900 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-white">{routine.name}</h2>
                <p className="text-sm text-gray-400 mt-2">{routine.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreRoutines;

