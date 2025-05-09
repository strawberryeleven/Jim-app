import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import MuscleBalanceRadarChart from "@/components/MuscleBalanceRadarChart"; 


const Statistics = () => {
  return (
    <div className="min-h-screen p-4 ">
      <div className="flex items-center mb-4">
        <Link to="/profile">
          <ArrowLeft className="w-5 h-5 mr-3 text-white" />
        </Link>
        <h1 className="text-lg font-semibold text-white">Statistics</h1>
      </div>

      <h2 className="text-md font-medium text-white mb-2">
        Last 7 days body graph
      </h2>

      <div className="flex items-center space-x-2 mb-6">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div
            key={index}
            className={`w-10 h-12 flex flex-col items-center justify-center rounded-lg ${
              index === 6 ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
            }`}
          >
            <span className="text-sm">{day}</span>
            <span className="text-xs">
              {new Date(Date.now() - (6 - index) * 86400000).getDate()}
            </span>
          </div>
        ))}
      </div>

      <div  className=" pb-0 text-white">
        <MuscleBalanceRadarChart />
      </div>
    </div>
  );
};

export default Statistics;
