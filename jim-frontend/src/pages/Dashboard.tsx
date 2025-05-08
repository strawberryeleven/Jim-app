import { Card } from "@/components/ui/cards/card";
import { LineChart, Dumbbell, Ruler, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6 w-full pt-3">
      <h2 className="text-lg pt-1 font-medium text-gray-400">Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <Link to="/statistics">
        <Card className="p-4 bg-black/40 hover:bg-black/50 transition-colors rounded-2xl shadow-md shadow-black/30">
          <div className="flex items-center space-x-3">
            <LineChart className="text-white w-5 h-5" />
            <div>
              <h3 className="text-base font-semibold text-white">Statistics</h3>
              <p className="text-sm text-gray-400">Track progress</p>
            </div>
          </div>
        </Card>
        </Link>
        
        <Link to="/add-exercise">
        <Card className="p-4 bg-black/40 hover:bg-black/50 transition-colors rounded-2xl shadow-md shadow-black/30">
          <div className="flex items-center space-x-3">
            <Dumbbell className="text-white w-5 h-5" />
            <div>
              <h3 className="text-base font-semibold text-white">Exercises</h3>
              <p className="text-sm text-gray-400">Browse workouts</p>
            </div>
          </div>
        </Card>
        </Link>

        <Link to="/measurements">
        <Card className="p-4 bg-black/40 hover:bg-black/50 transition-colors rounded-2xl shadow-md shadow-black/30">
          <div className="flex items-center space-x-3">
            <Ruler className="text-white w-5 h-5" />
            <div>
              <h3 className="text-base font-semibold text-white">Measures</h3>
              <p className="text-sm text-gray-400">Track body data</p>
            </div>
          </div>
        </Card>
        </Link>

        <Link to="/calendar">
        <Card className="p-4 bg-black/40 hover:bg-black/50 transition-colors rounded-2xl shadow-md shadow-black/30">
          <div className="flex items-center space-x-3">
            <CalendarDays className="text-white w-5 h-5" />
            <div>
              <h3 className="text-base font-semibold text-white">Calendar</h3>
              <p className="text-sm text-gray-400">Your schedule</p>
            </div>
          </div>
        </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
