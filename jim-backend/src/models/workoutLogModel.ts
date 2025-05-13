import mongoose, { Schema, Document } from 'mongoose';

export interface IExerciseSummary {
  name: string;
  sets: number;
  image: string;
  weight?: number;
  reps?: number;
  muscle?: string;
}

export interface IWorkoutLog extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  time: string;
  volume: string;
  date: string;
  isPublic: boolean;
  notes?: string;
  exercises: IExerciseSummary[];
  totalSets: number;
  duration: number;
  muscleGroups: {
    [key: string]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const exerciseSummarySchema = new Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  image: { type: String, required: true },
  weight: { type: Number },
  reps: { type: Number },
  muscle: { type: String }
});

const workoutLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  time: {
    type: String,
    required: true
  },
  volume: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    trim: true
  },
  exercises: [exerciseSummarySchema],
  totalSets: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  muscleGroups: {
    type: Object,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes
workoutLogSchema.index({ userId: 1 });
workoutLogSchema.index({ date: 1 });
workoutLogSchema.index({ isPublic: 1 });

export default mongoose.model<IWorkoutLog>('WorkoutLog', workoutLogSchema);