import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutine extends Document {
  name: string;
  description: string;
  exercises: {
    exerciseId: mongoose.Types.ObjectId;
    sets: {
      weight: number;
      reps: number;
      isCompleted: boolean;
    }[];
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
    exercises: [{
      exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true,
      },
      sets: [{
        weight: {
          type: Number,
          required: true,
        },
        reps: {
          type: Number,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        }
      }],
      order: {
        type: Number,
        required: true,
      }
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublic: {
      type: Boolean,
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

const Routine = mongoose.model<IRoutine>('Routine', routineSchema);

export default Routine;