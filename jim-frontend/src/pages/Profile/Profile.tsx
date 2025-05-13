import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { setProfileData } from '@/store/slices/profileSlice';
import { fetchWorkoutLogs } from '@/store/slices/WorkoutLogSlice';
import { Button } from '@/components/buttons/button';
import { Settings } from 'lucide-react';
import WorkoutChart from '@/components/workout/WorkoutChart';
import Dashboard from './Dashboard';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, loading } = useSelector((state: RootState) => state.profile);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900 text-white relative overflow-hidden">
      {/* Abstract Background Forms */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-zinc-800/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-blue-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-blue-400">Profile</h1>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white transition-colors"
            onClick={() => navigate('/settings')}
          >
            <Settings className="h-6 w-6" />
          </Button>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {/* Profile Info */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full bg-zinc-900 mb-6 ring-4 ring-zinc-800" />
              
              {/* Username */}
              <h2 className="text-2xl font-bold text-white mb-6">{profile?.username}</h2>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 w-full max-w-md">
                {profile?.stats && Object.entries(profile.stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {value}
                    </div>
                    <div className="text-sm text-gray-400 capitalize">{key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workout Chart */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <WorkoutChart />
          </div>

          {/* Dashboard */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <Dashboard />
          </div>

          {/* Recent Workouts Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Workouts</h2>
            {logs && Object.entries(logs).slice(0, 5).map(([date, workouts]) => (
              <div key={date} className="mb-4 last:mb-0">
                <h3 className="text-sm text-gray-400 mb-2">{new Date(date).toLocaleDateString()}</h3>
                {workouts.map((workout: any) => (
                  <div key={workout.id} className="bg-white/5 rounded-lg p-4 mb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">{workout.title}</h4>
                        <p className="text-sm text-gray-400">{workout.exercises.length} exercises</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">{workout.duration} min</p>
                        <p className="text-sm text-gray-400">{workout.volume} kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;