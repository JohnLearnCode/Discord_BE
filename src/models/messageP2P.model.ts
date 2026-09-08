import mongoose, { Model, Schema, Types } from 'mongoose';
import { MessageP2P } from '../types/index.js';

export interface IMessageP2PDocument extends Omit<MessageP2P, '_id'> {
  _id: Types.ObjectId;
}

type MessageP2PModel = Model<IMessageP2PDocument>;

const messageP2PSchema = new Schema<IMessageP2PDocument>(
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
    message: {
      type: String,
      default: '',
    },
    imageMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

const MessageP2PModel: MessageP2PModel = mongoose.model<IMessageP2PDocument>('MessageP2P', messageP2PSchema);

export default MessageP2PModel;
