import mongoose, { Model, Schema, Types } from 'mongoose';
import { VoiceChannel } from '../types/index.js';

export interface IVoiceChannelDocument extends Omit<VoiceChannel, '_id'> {
  _id: Types.ObjectId;
}

type VoiceChannelModel = Model<IVoiceChannelDocument>;

const voiceChannelSchema = new Schema<IVoiceChannelDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);

const VoiceChannelModel: VoiceChannelModel = mongoose.model<IVoiceChannelDocument>('VoiceChannel', voiceChannelSchema);

export default VoiceChannelModel;
