import mongoose, { Model, Schema, Types } from 'mongoose';
import { Server } from '../types/index.js';

export interface IServerDocument extends Omit<Server, '_id'> {
  _id: Types.ObjectId;
}

type ServerModel = Model<IServerDocument>;

const serverSchema = new Schema<IServerDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    iconUrl: {
      type: String,
      default: '',
    },
    memberIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    channelIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Channel',
      default: [],
    },
    catalogIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Catalog',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const ServerModel: ServerModel = mongoose.model<IServerDocument>('Server', serverSchema);

export default ServerModel;
