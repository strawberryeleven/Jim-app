import { useState } from "react";
import { BarChart2 } from "lucide-react"; // icon
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample user workout data (can be fetched from a database)
const sampleWorkouts = [
  { day: "Mon", duration: 30 },
  { day: "Tue", duration: 45 },
  { day: "Wed", duration: 20 },
  
];

const WorkoutSummaryCard = () => {
  const [activeTab, setActiveTab] = useState("Duration");
  const [workoutData, setWorkoutData] = useState(sampleWorkouts); // Replace with actual data
  const hasData = workoutData && workoutData.length > 0;

  const tabs = ["Duration", "Volume", "Reps"];

  return (
    <div className="bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-700 w-full mx-auto">
      <div className="h-40 border border-gray-700 rounded-lg mb-4 flex items-center justify-center bg-gray-800">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" /> {/* gray-600 */}
              <XAxis dataKey="day" stroke="#D1D5DB" /> {/* gray-300 */}
              <YAxis stroke="#D1D5DB" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937", // gray-800
                  border: "1px solid #4B5563", // gray-600
                  color: "#F9FAFB", // gray-50
                }}
                itemStyle={{ color: "#F9FAFB" }}
              />
              <Bar dataKey="duration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center">
            <BarChart2 className="text-gray-400 mb-2" size={32} />
            <p className="text-gray-400">No data yet</p>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-3 mb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-700 text-gray-200 border-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WorkoutSummaryCard;
