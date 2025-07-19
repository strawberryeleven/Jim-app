import { ArrowLeft, Calendar, TrendingUp, Dumbbell, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/cards/card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchWorkoutLogs, setSelectedDate, WorkoutLog } from "@/store/slices/WorkoutLogSlice";
import { AppDispatch } from "@/store/store";
import MuscleBalanceRadarChart from "@/components/charts/MuscleBalanceRadarChart";
import React from "react";

// Memoized component for weekly activity
const WeeklyActivity = React.memo(({ onDateSelect }: { onDateSelect: (date: string) => void }) => {
  const days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      result.push({
        day: ["S", "M", "T", "W", "T", "F", "S"][date.getDay()],
        date: date.toISOString().split("T")[0],
        dateNum: date.getDate()
      });
    }
    return result;
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {days.map(({ day, date, dateNum }) => (
        <button
          key={date}
          onClick={() => onDateSelect(date)}
          className={`w-12 h-16 flex flex-col items-center justify-center rounded-lg transition-colors hover:bg-zinc-600 ${
            date === new Date().toISOString().split("T")[0]
              ? "bg-blue-500 text-white"
              : "bg-zinc-700 text-gray-300"
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          <span className="text-xs mt-1">{dateNum}</span>
        </button>
      ))}
    </div>
  );
});

// Memoized component for quick stats
const QuickStats = React.memo(({ stats }: { stats: any }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-zinc-800 border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Workouts</p>
            <p className="text-xl font-semibold text-white">{stats.totalWorkouts}</p>
          </div>
        </div>
      </Card>
      <Card className="bg-zinc-800 border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Volume</p>
            <p className="text-xl font-semibold text-white">{stats.totalVolume} kg</p>
          </div>
        </div>
      </Card>
      <Card className="bg-zinc-800 border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Dumbbell className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Sets</p>
            <p className="text-xl font-semibold text-white">{stats.totalSets}</p>
          </div>
        </div>
      </Card>
      <Card className="bg-zinc-800 border-gray-700 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Time</p>
            <p className="text-xl font-semibold text-white">{Math.round(stats.totalDuration / 60)} hrs</p>
          </div>
        </div>
      </Card>
    </div>
  );
});

const Statistics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, selectedDate, loading } = useSelector((state: RootState) => state.workoutLogs);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalVolume: 0,
    totalSets: 0,
    totalDuration: 0,
    muscleGroupDistribution: {}
  });

  // Fetch workout logs on mount
  useEffect(() => {
    dispatch(fetchWorkoutLogs());
  }, [dispatch]);

  // Calculate stats when logs change
  useEffect(() => {
    const newStats = {
      totalWorkouts: 0,
      totalVolume: 0,
      totalSets: 0,
      totalDuration: 0,
      muscleGroupDistribution: {} as Record<string, number>
    };

    Object.values(logs).forEach(logsForDate => {
      (logsForDate as WorkoutLog[]).forEach(log => {
        newStats.totalWorkouts++;
        newStats.totalVolume += parseInt(log.volume);
        newStats.totalSets += log.totalSets;
        newStats.totalDuration += log.duration;

        Object.entries(log.muscleGroups).forEach(([muscle, volume]) => {
          newStats.muscleGroupDistribution[muscle] = (newStats.muscleGroupDistribution[muscle] || 0) + (volume as number);
        });
      });
    });

    setStats(newStats);
  }, [logs]);

  const handleDateSelect = useCallback((date: string) => {
    dispatch(setSelectedDate(date));
  }, [dispatch]);

  // Get selected date's logs
  const selectedDateLogs = useMemo(() => {
    if (!selectedDate) return [];
    return logs[selectedDate] || [];
  }, [logs, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/profile" className="hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white ml-4">Statistics</h1>
        </div>

        {/* Quick Stats */}
        <QuickStats stats={stats} />

        {/* Weekly Activity */}
        <Card className="bg-zinc-800 border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Weekly Activity</h2>
          <WeeklyActivity onDateSelect={handleDateSelect} />
        </Card>

        {/* Muscle Balance Chart */}
        <Card className="bg-zinc-800 border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Muscle Balance</h2>
          <div className="h-[400px]">
            <MuscleBalanceRadarChart data={stats.muscleGroupDistribution} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
