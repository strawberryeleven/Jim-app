import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const muscleData = [
  { muscle: "Chest", value: 80 },
  { muscle: "Back", value: 65 },
  { muscle: "Legs", value: 90 },
  { muscle: "Shoulders", value: 70 },
  { muscle: "Arms", value: 60 },
  { muscle: "Core", value: 75 },
];

const MuscleBalanceRadarChart = () => {
  return (
    <div className="w-full h-96 p-4 rounded-2xl shadow-sm">
      <h2 className="text-white text-xl font-bold mb-4 text-center">
        Muscle Balance Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={muscleData}>
          <PolarGrid stroke="#6B7280" />
          <PolarAngleAxis dataKey="muscle" stroke="#E5E7EB" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" />
          <Radar
            name="Muscle Group"
            dataKey="value"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.6}
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MuscleBalanceRadarChart;
