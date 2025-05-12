export interface WorkoutLog {
  id: string;
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic: boolean;
  notes?: string;
  exercises: {
    name: string;
    sets: number;
    image: string;
    weight?: number;
    reps?: number;
    muscle?: string;
  }[];
  totalSets: number;
  duration: number;
  muscleGroups: {
    [key: string]: number;
  };
} 