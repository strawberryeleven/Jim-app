import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutine extends Document {
  name: string;
  description: string;
  workouts: {
    workout: mongoose.Types.ObjectId;
    day: number;
    order: number;
  }[];
  createdBy: mongoose.Types.ObjectId;
  isPublic: boolean;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const routineSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    workouts: [{
      workout: {
        type: Schema.Types.ObjectId,
        ref: 'Workout',
        required: true,
      },
      day: {
        type: Number,
        required: true,
        min: 1,
        max: 7,
      },
      order: {
        type: Number,
        required: true,
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
      required: true,
      default: false,
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
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
routineSchema.index({ createdBy: 1 });
routineSchema.index({ isPublic: 1 });

export default mongoose.model<IRoutine>('Routine', routineSchema);