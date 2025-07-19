import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface IUser extends Document {
  _id: ObjectId; // Explicitly define _id
  name: string;
  email: string;
  password: string;
  profileImage?: string;
  bio?: string;
  followers: ObjectId[];
  following: ObjectId[];
  isActive: boolean;
  lastLogin?: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  bio: { type: String, default: '' },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  following: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  isActive: { type: Boolean, default: false },
  lastLogin: { type: Date },
});

export default model<IUser>('User', userSchema);