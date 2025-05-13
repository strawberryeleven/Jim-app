import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const WorkoutChart = () => {
  const { logs } = useSelector((state: RootState) => state.workoutLogs);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayWorkouts = logs[date] || [];
      const totalVolume = dayWorkouts.reduce((sum, workout) => 
        sum + parseInt(workout.volume), 0);
      const totalDuration = dayWorkouts.reduce((sum, workout) => 
        sum + workout.duration, 0);

      return {
        day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        volume: totalVolume,
        duration: totalDuration,
      };
    });
  }, [logs]);

  const hasData = chartData.some(day => day.volume > 0 || day.duration > 0);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-white mb-6">Weekly Activity</h2>
      <div className="h-64">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="day" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  color: '#F9FAFB',
                }}
                itemStyle={{ color: '#F9FAFB' }}
              />
              <Bar 
                dataKey="volume" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
                name="Volume (kg)"
              />
              <Bar 
                dataKey="duration" 
                fill="#10B981" 
                radius={[4, 4, 0, 0]}
                name="Duration (min)"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BarChart2 className="w-12 h-12 mb-2" />
            <p>No workout data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutChart; 