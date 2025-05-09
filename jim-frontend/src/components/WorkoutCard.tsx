import WorkoutPost from "./WorkoutPost";

interface Workout {
  title: string;
  time: string;
  volume: string;
  exercises: {
    name: string;
    sets: number;
    image: string;
  }[];
}
interface WorkoutCardProps {
  workouts: Workout[];
}
export default function WorkoutCard({ workouts }: WorkoutCardProps) {
  if (!workouts || workouts.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="border rounded-lg p-6 flex flex-col items-center justify-center space-y-2 text-gray-400">
          <img
            src="https://img.icons8.com/ios-filled/50/808080/dumbbell.png"
            alt="No workouts"
            className="w-6 h-6"
          />
          <div className="text-sm">No workouts</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout, idx) => (
        <WorkoutPost key={idx} workout={workout} />
      ))}
    </div>
  );
}
