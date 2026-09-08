import mongoose, { Model, Schema, Types } from 'mongoose';
import { TextChannel } from '../types/index.js';

export interface ITextChannelDocument extends Omit<TextChannel, '_id'> {
  _id: Types.ObjectId;
}

type TextChannelModel = Model<ITextChannelDocument>;

const textChannelSchema = new Schema<ITextChannelDocument>(
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

const TextChannelModel: TextChannelModel = mongoose.model<ITextChannelDocument>('TextChannel', textChannelSchema);

export default TextChannelModel;
