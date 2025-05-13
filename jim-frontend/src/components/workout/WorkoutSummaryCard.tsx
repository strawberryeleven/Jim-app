import { Clock, Dumbbell, Calendar } from "lucide-react";
import { formatDuration } from "@/utils/FormatTime";

interface WorkoutSummaryCardProps {
  duration: number;
  volume: number;
  date: string;
}

const WorkoutSummaryCard = ({ duration, volume, date }: WorkoutSummaryCardProps) => {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration</span>
          </div>
          <p className="text-lg font-medium text-white">{formatDuration(duration)}</p>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Dumbbell className="w-4 h-4" />
            <span className="text-sm">Volume</span>
          </div>
          <p className="text-lg font-medium text-white">{volume} kg</p>
        </div>
        <div className="bg-zinc-900/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Date</span>
          </div>
          <p className="text-lg font-medium text-white">{date}</p>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSummaryCard; 