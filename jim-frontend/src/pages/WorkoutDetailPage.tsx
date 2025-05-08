import { useParams, useNavigate } from "react-router-dom";
import { CalendarX, ArrowLeft } from "lucide-react";
import { UserCircle, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import WorkoutPost from "../components/WorkoutPost";

const workoutLogs = {
  "2025-05-03": [
    {
      title: "Afternoon workout 💪",
      time: "0min",
      volume: "6 kg",
      exercises: [
        {
          sets: 1,
          name: "Bench Press (Barbell)",
          image:
            "https://www.strengthlog.com/wp-content/uploads/2021/05/Bench-press-barbell.png",
        },
      ],
    },
  ],
  // Add more mock entries if needed
};
export default function WorkoutDetailPage() {
  const { date } = useParams();
  const navigate = useNavigate();
  const workouts = workoutLogs[date || ""] || [];

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={() => navigate(-1)}
        className="text-sm flex items-center space-x-1 text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
      </button>

      <h2 className="text-lg font-bold">
        {new Date(date || "").toDateString()}
      </h2>

      {workouts.length === 0 ? (
        <div className="text-center mt-10 space-y-3">
          <CalendarX className="w-10 h-10 mx-auto text-gray-400" />
          <p className="text-gray-500">No workouts on this day</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md shadow">
            Log a workout
          </button>
        </div>
      ) : (
        workouts.map((workout, index) => (
          <WorkoutPost key={index} workout={workout} />
        ))
      )}
    </div>
  );
}
