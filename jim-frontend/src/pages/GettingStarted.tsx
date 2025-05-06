import { Button } from "@/components/ui/buttons/button";
import { useNavigate } from "react-router-dom";

const GettingStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">Getting Started</h1>

      <div className="space-y-4">
        <section>
          <h2 className="text-xl font-semibold">🏋️ Workout</h2>
          <p>
            You can log a new workout from the "Quick Start" section. Add exercises, track sets and reps, and let your followers—or even the world—see your progress!
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">📋 Routines</h2>
          <p>
            Create your own workout routines and save them for daily use. These routines help you maintain consistency and focus.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">🌍 Explore</h2>
          <p>
            Explore routines made by others including workouts and diets to get inspiration and try new plans that match your goals.
          </p>
        </section>
      </div>

      <Button variant="secondary" onClick={() => navigate(-1)}>
        ← Back
      </Button>
    </div>
  );
};

export default GettingStarted;
