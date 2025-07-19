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
import { authService } from '@/services/authService';
import { useToast } from '@/components/tooltips/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { data: profile, loading } = useSelector((state: RootState) => state.profile);
  const { logs } = useSelector((state: RootState) => state.workoutLogs);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authService.getProfile();
        dispatch(setProfileData({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          stats: {
            workouts: userData.workoutCount || 0,
            followers: userData.followersCount || 0,
            following: userData.followingCount || 0,
          },
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch profile data',
          variant: 'destructive',
        });
      }
    };

    fetchProfile();
    dispatch(fetchWorkoutLogs());
  }, [dispatch, toast]);

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
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-blue-900">
      <div className="max-w-4xl mx-auto p-4">
        {/* Profile Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="text-gray-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full bg-zinc-900 mb-6 ring-4 ring-zinc-800 overflow-hidden">
              {profile?.profileImage && (
                <img
                  src={profile.profileImage}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            
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
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-6">
          <WorkoutChart />
        </div>

        {/* Dashboard */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-6">
          <Dashboard />
        </div>

        {/* Recent Workouts Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Workouts</h2>
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
  );
};

export default Profile;