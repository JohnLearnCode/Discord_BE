import mongoose, { Model, Schema, Types } from 'mongoose';
import { Upload, UploadResourceType } from '../types/index.js';

export interface IUploadDocument extends Omit<Upload, '_id'> {
  _id: Types.ObjectId;
}

type UploadModel = Model<IUploadDocument>;

const uploadSchema = new Schema<IUploadDocument>(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      enum: Object.values(UploadResourceType),
      required: true,
    },
    folder: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    originalName: {
      type: String,
      default: '',
    },
    uploaderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UploadModel: UploadModel = mongoose.model<IUploadDocument>('Upload', uploadSchema);

export default UploadModel;
