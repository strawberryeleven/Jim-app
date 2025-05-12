import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/buttons/button";
import { Card } from "@/components/cards/card";
import { Plus, Search, ChevronDown, ChevronUp } from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";
import RoutineCard from "@/components/workout/RoutineCard";

const Workout = () => {
  const navigate = useNavigate();
  const [myRoutinesExpanded, setMyRoutinesExpanded] = useState(false);

  // ✅ Correct selector for routines
  const routines = useAppSelector((state) => state.routines.routines);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Workout</h1>
        <span className="text-yellow-500 font-semibold">PRO</span>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Start</h2>
          <Button
            variant="outline"
            className="w-full bg-white text-black hover:bg-gray-200 transition-colors duration-200"
            onClick={() => navigate("/log-workout")}
          >
            + Start Empty Workout
          </Button>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Routines</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card
              className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
              onClick={() => navigate("/create-routine")}
            >
              <h3 className="text-lg font-semibold text-white">New Routine</h3>
            </Card>
            <Card
              className="p-6 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
              onClick={() => navigate("/routines")}
            >
              <h3 className="text-lg font-semibold text-white">Explore Routines</h3>
            </Card>
          </div>
        </section>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => navigate("/getting-started")}
        >
          How to get started
        </Button>
      </div>

      {/* My Routines Section */}
      <div className="mb-2">
        <button
          className="flex w-full items-center justify-between py-2 text-left"
          onClick={() => setMyRoutinesExpanded(!myRoutinesExpanded)}
        >
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-300">My Routines</h3>
            <span className="ml-2 bg-zinc-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">
              {routines.length}
            </span>
          </div>
          {myRoutinesExpanded ? (
            <ChevronUp size={20} className="text-gray-400" />
          ) : (
            <ChevronDown size={20} className="text-gray-400" />
          )}
        </button>

        {myRoutinesExpanded && (
          <div className="mt-4">
            {routines.length > 0 ? (
              routines.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No routines yet. Create your first one!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workout;
