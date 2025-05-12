import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkoutLog extends Document {
  user: mongoose.Types.ObjectId;
  workout: mongoose.Types.ObjectId;
  date: Date;
  exercises: {
    exercise: mongoose.Types.ObjectId;
    sets: {
      reps: number;
      weight?: number;
      duration?: number;
      completed: boolean;
    }[];
  }[];
  notes?: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const workoutLogSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workout: {
      type: Schema.Types.ObjectId,
      ref: 'Workout',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    exercises: [{
      exercise: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      sets: [{
        reps: {
          type: Number,
          required: true,
        },
        weight: {
          type: Number,
        },
        duration: {
          type: Number,
        },
        completed: {
          type: Boolean,
          required: true,
        },
      }],
    }],
    notes: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create indexes
workoutLogSchema.index({ user: 1 });
workoutLogSchema.index({ workout: 1 });
workoutLogSchema.index({ date: 1 });

export default mongoose.model<IWorkoutLog>('WorkoutLog', workoutLogSchema);