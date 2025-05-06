import React from "react";

interface WorkoutStatsProps {
  duration: number;
  volume: number;
  totalSets: number;
}

const WorkoutStats: React.FC<WorkoutStatsProps> = ({
  duration,
  volume,
  totalSets,
}) => {
  return (
    <div className="flex justify-around text-center text-sm border-b border-gray-700 pb-4">
      <div>
        <p className="text-gray-400">Duration</p>
        <p>
          {Math.floor(duration / 60)}m {duration % 60}s
        </p>
      </div>
      <div>
        <p className="text-gray-400">Volume</p>
        <p>{volume} kg</p>
      </div>
      <div>
        <p className="text-gray-400">Sets</p>
        <p>{totalSets}</p>
      </div>
    </div>
  );
};

export default WorkoutStats;