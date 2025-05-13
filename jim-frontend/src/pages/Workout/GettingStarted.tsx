import { Button } from "@/components/buttons/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // Ensure lucide-react is installed

const GettingStarted = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white relative overflow-hidden">
      {/* Abstract Background Forms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-zinc-800/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back</span>
        </button>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          <h1 className="text-2xl font-bold text-blue-400">Getting Started</h1>

          <div className="space-y-6">
            <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">🏋 Workout</h2>
              <p className="text-gray-300 leading-relaxed">
                You can log a new workout from the "Quick Start" section. Add exercises, track sets and reps, and let your followers—or even the world—see your progress!
              </p>
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">📋 Routines</h2>
              <p className="text-gray-300 leading-relaxed">
                Create your own workout routines and save them for daily use. These routines help you maintain consistency and focus.
              </p>
            </section>

            <section className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">🌍 Explore</h2>
              <p className="text-gray-300 leading-relaxed">
                Explore routines made by others including workouts and diets to get inspiration and try new plans that match your goals.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GettingStarted;