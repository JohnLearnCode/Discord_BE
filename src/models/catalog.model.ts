import mongoose, { Model, Schema, Types } from 'mongoose';
import { Catalog } from '../types/index.js';

export interface ICatalogDocument extends Omit<Catalog, '_id'> {
  _id: Types.ObjectId;
}

type CatalogModel = Model<ICatalogDocument>;

const catalogSchema = new Schema<ICatalogDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 100,
    },
    channelIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Channel',
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const CatalogModel: CatalogModel = mongoose.model<ICatalogDocument>('Catalog', catalogSchema);

export default CatalogModel;
