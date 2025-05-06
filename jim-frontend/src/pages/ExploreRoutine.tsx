import { Card } from "@/components/ui/cards/card";
import { useNavigate } from "react-router-dom";

const routines = [
  {
    id: 1,
    name: "Full Body Blast",
    description: "A balanced routine to hit every muscle group.",
  },
  {
    id: 2,
    name: "Leg Day Strength",
    description: "Focuses on lower body power and endurance.",
  },
  {
    id: 3,
    name: "Push Pull Split",
    description: "Classic push/pull split over 4 days.",
  },
  {
    id: 4,
    name: "HIIT Burn",
    description: "High intensity interval training for fat loss.",
  },
  {
    id: 5,
    name: "Upper Body Sculpt",
    description: "Focus on chest, back, shoulders, and arms.",
  },
  {
    id: 6,
    name: "Core Crusher",
    description: "Build a strong and defined midsection.",
  },
];

const ExploreRoutines = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
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
