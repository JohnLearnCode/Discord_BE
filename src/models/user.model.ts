import mongoose, { HydratedDocument, Model, Schema, Types } from 'mongoose';
import { User, UserRole } from '../types/index.js';

export interface IUserDocument extends Omit<User, '_id'> {
  _id: Types.ObjectId;
}

export interface IUserMethods {
  toJSON(): Omit<User, 'passwordHash'>;
}

export type IUserDoc = HydratedDocument<IUserDocument, IUserMethods>;

type UserModel = Model<IUserDocument, Record<string, never>, IUserMethods>;

const userSchema = new Schema<IUserDocument, UserModel, IUserMethods>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      default: '',
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    serverIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    jointServer: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
    friends: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.toJSON = function toJSON() {
  const user = this.toObject();
  delete (user as { passwordHash?: string }).passwordHash;
  return user;
};

const User: UserModel = mongoose.model<IUserDocument, UserModel>('User', userSchema);

export default User;
