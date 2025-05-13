import { Settings } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { Link } from "react-router-dom";
import WorkoutChart from "../Workout/StartWorkout/WorkoutSummaryCard";
import Dashboard from "./Dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfileData } from "@/store/slices/profileSlice";
import { fetchWorkoutLogs, WorkoutLog } from "@/store/slices/WorkoutLogSlice";
import { AppDispatch } from "@/store/store";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.data);
  const loading = useSelector((state: RootState) => state.profile.loading);
  const { logs } = useSelector((state: RootState) => state.workoutLogs);

  useEffect(() => {
    // TODO: Replace with actual API call
    const mockProfileData = {
      id: "1",
      username: "ahmad13424",
      email: "ahmad@example.com",
      stats: {
        workouts: 0,
        followers: 0,
        following: 0,
      },
    };
    dispatch(setProfileData(mockProfileData));
    dispatch(fetchWorkoutLogs());
  }, [dispatch]);

  // Get recent workouts
  const recentWorkouts = Object.entries(logs)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
    .slice(0, 5)
    .flatMap(([date, logsForDate]) => logsForDate);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link to="/edit-profile" state={{ from: 'profile' }}>
            <h1 className="text-2xl font-bold text-blue-500 hover:text-blue-600 transition-colors">
              Edit Profile
            </h1>
          </Link>
          <Link to="/settings">
            <Settings className="w-6 h-6 text-gray-400 hover:text-white transition-colors" />
          </Link>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center mb-12">
          {/* Profile Picture */}
          <div className="w-32 h-32 rounded-full bg-gray-700 mb-6 ring-4 ring-gray-800" />
          
          {/* Username */}
          <h2 className="text-2xl font-bold text-white mb-6">{profile?.username}</h2>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-md mb-12">
            {profile?.stats && Object.entries(profile.stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">
                  {value}
                </div>
                <div className="text-sm text-gray-400 capitalize">{key}</div>
              </div>
            ))}
          </div>

          {/* Workout Chart */}
          <div className="w-full max-w-4xl mb-12">
            <WorkoutChart />
          </div>

          {/* Dashboard */}
          <div className="w-full max-w-4xl mb-12">
            <Dashboard />
          </div>

          {/* Recent Workouts Section */}
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-300 mb-6">Recent Workouts</h2>
            <div className="space-y-4">
              {recentWorkouts.map((workout: WorkoutLog) => (
                <div key={workout.id} className="bg-zinc-800 rounded-lg p-6 border border-zinc-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{workout.title}</h3>
                      <p className="text-sm text-gray-400">{new Date(workout.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Duration: {workout.duration} min</p>
                      <p className="text-sm text-gray-400">Volume: {workout.volume} kg</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Exercises:</h4>
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between bg-zinc-700 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={exercise.image} 
                              alt={exercise.name} 
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-white font-medium">{exercise.name}</p>
                              <p className="text-sm text-gray-400">{exercise.muscle}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white">{exercise.sets} sets</p>
                            {exercise.weight && exercise.reps && (
                              <p className="text-sm text-gray-400">
                                {exercise.weight}kg × {exercise.reps} reps
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {workout.notes && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Notes:</h4>
                      <p className="text-gray-400 text-sm">{workout.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;