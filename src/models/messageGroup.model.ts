import mongoose, { Model, Schema, Types } from 'mongoose';
import { MessageGroup } from '../types/index.js';

export interface IMessageGroupDocument extends Omit<MessageGroup, '_id'> {
  _id: Types.ObjectId;
}

type MessageGroupModel = Model<IMessageGroupDocument>;

const messageGroupSchema = new Schema<IMessageGroupDocument>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'TextChannel',
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

const MessageGroupModel: MessageGroupModel = mongoose.model<IMessageGroupDocument>('MessageGroup', messageGroupSchema);

export default MessageGroupModel;
