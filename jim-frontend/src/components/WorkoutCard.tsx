import { WorkoutLog } from '../types/workout';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Card } from "@/components/cards/card";
import { Clock, Dumbbell, Layers, Eye, EyeOff } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  image: string;
  weight?: number;
  reps?: number;
}

interface Workout {
  id: string;
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic: boolean;
  notes?: string;
  exercises: Exercise[];
  totalSets: number;
  duration: number;
}

interface WorkoutCardProps {
  workouts: Workout[];
}

const WorkoutCard = () => {
  const { logs } = useSelector((state: RootState) => state.workoutLogs);

  // Flatten and sort logs by date and time
  const sortedLogs = Object.entries(logs)
    .flatMap(([date, dateLogs]) => 
      (dateLogs as WorkoutLog[]).map(log => ({
        ...log,
        date
      }))
    )
    .sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

  if (sortedLogs.length === 0) {
    return (
      <div className="text-gray-400 text-center py-4">
        No workouts logged yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedLogs.map(log => (
        <div key={log.id} className="bg-zinc-800 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-medium">{log.title}</h3>
            <div className="text-right">
              <div className="text-gray-400 text-sm">{log.date}</div>
              <div className="text-gray-400 text-sm">{log.time}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-400">
            <div>Volume: {log.volume} kg</div>
            <div>Sets: {log.totalSets}</div>
            <div>Duration: {log.duration} min</div>
          </div>
          {log.notes && (
            <p className="text-gray-400 text-sm mt-2">{log.notes}</p>
          )}
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Exercises:</h4>
            <div className="space-y-2">
              {log.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {exercise.name} - {exercise.sets} sets
                  {exercise.weight && ` @ ${exercise.weight}kg`}
                  {exercise.reps && ` × ${exercise.reps} reps`}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutCard;
