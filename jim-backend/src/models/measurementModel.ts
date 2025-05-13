import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IMeasurement extends Document {
  userId: ObjectId;
  date: Date;
  weight: number;
  chest: number;
  waist: number;
  arms: number;
  createdAt: Date;
  updatedAt: Date;
}

const measurementSchema = new Schema<IMeasurement>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  weight: { type: Number, required: true },
  chest: { type: Number, required: true },
  waist: { type: Number, required: true },
  arms: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create indexes
measurementSchema.index({ userId: 1 });
measurementSchema.index({ date: 1 });

export default model<IMeasurement>('Measurement', measurementSchema); 