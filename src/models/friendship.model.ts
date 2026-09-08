import mongoose, { Model, Schema, Types } from 'mongoose';
import { Friendship, FriendshipStatus } from '../types/index.js';

export interface IFriendshipDocument extends Omit<Friendship, '_id'> {
  _id: Types.ObjectId;
}

type FriendshipModel = Model<IFriendshipDocument>;

const friendshipSchema = new Schema<IFriendshipDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FriendshipStatus),
      default: FriendshipStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

friendshipSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const FriendshipModel: FriendshipModel = mongoose.model<IFriendshipDocument>('Friendship', friendshipSchema);

export default FriendshipModel;
