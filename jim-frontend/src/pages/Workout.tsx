import { Button } from "@/components/ui/buttons/button";
import { Card } from "@/components/ui/cards/card";
import { useNavigate } from "react-router-dom";

const Workout = () => {
  const navigate = useNavigate();

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
            className="w-full bg-black/40"
            onClick={() => navigate("/add-exercise")}
          >
            + Start Empty Workout
          </Button>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-4">Routines</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
              <h3 className="text-lg font-semibold text-white">New Routine</h3>
            </Card>
            <Card className="p-6 bg-black/40 hover:bg-black/50 transition-colors">
              <h3 className="text-lg font-semibold text-white">
                Explore Routines
              </h3>
            </Card>
          </div>
        </section>

        <Button variant="secondary" className="w-full">
          How to get started
        </Button>
      </div>
    </div>
  );
};

export default Workout;
