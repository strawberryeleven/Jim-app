import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IProfile extends Document {
  userId: ObjectId;
  username: string;
  bio?: string;
  link?: string;
  sex?: string;
  DOB?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  username: { type: String, required: true },
  bio: { type: String, default: '' },
  link: { type: String, default: '' },
  sex: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
  DOB: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create indexes
profileSchema.index({ userId: 1 });
profileSchema.index({ username: 1 });

export default model<IProfile>('Profile', profileSchema); 