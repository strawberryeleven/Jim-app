import { Settings } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { Link } from "react-router-dom";
import WorkoutChart from "../Workout/StartWorkout/WorkoutSummaryCard";
import Dashboard from "./Dashboard";
import WorkoutCard from "@/components/WorkoutCard";
import { workouts } from "@/data/Workouts";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProfileData } from "@/store/slices/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile.data);
  const loading = useSelector((state: RootState) => state.profile.loading);

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
  }, [dispatch]);

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

          {/* Workouts Section */}
          <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold text-gray-300 mb-6">Recent Workouts</h2>
            <div className="space-y-4">
              <WorkoutCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;