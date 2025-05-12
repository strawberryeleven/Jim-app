import React, { useMemo } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

interface MuscleBalanceRadarChartProps {
  data: Record<string, number>;
}

const MuscleBalanceRadarChart: React.FC<MuscleBalanceRadarChartProps> = React.memo(({ data }) => {
  // Transform data for the chart
  const chartData = useMemo(() => {
    const muscleGroups = [
      'chest',
      'back',
      'shoulders',
      'biceps',
      'triceps',
      'legs',
      'core',
      'forearms'
    ];

    return muscleGroups.map(muscle => ({
      muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1),
      volume: data[muscle] || 0,
      fullMark: Math.max(...Object.values(data), 1000) // Dynamic max value
    }));
  }, [data]);

  return (
    <div className="w-full h-96 p-4 rounded-2xl shadow-sm">
      <h2 className="text-white text-xl font-bold mb-4 text-center">
        Muscle Balance Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="muscle"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 'auto']}
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          <Radar
            name="Volume"
            dataKey="volume"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default MuscleBalanceRadarChart;
