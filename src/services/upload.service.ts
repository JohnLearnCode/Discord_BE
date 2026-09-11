import mongoose from 'mongoose';
import UploadModel, { IUploadDocument } from '../models/upload.model.js';
import { deleteImage } from '../config/cloudinary.js';
import ApiError from '../utils/ApiError.js';
import { UploadResourceType } from '../types/upload/enums.js';
import { UploadMessage } from '../types/upload/enums.js';

export interface CreateUploadData {
  url: string;
  publicId: string;
  resourceType: UploadResourceType;
  folder: string;
  format: string;
  size: number;
  originalName: string;
  uploaderId: string;
}

const uploadService = {
  async createUpload(data: CreateUploadData): Promise<IUploadDocument> {
    return UploadModel.create({
      url: data.url,
      publicId: data.publicId,
      resourceType: data.resourceType,
      folder: data.folder,
      format: data.format,
      size: data.size,
      originalName: data.originalName,
      uploaderId: new mongoose.Types.ObjectId(data.uploaderId),
    });
  },

  async getUploadById(id: string): Promise<IUploadDocument> {
    const upload = await UploadModel.findById(id).populate('uploaderId', 'username email avatarUrl');
    if (!upload) {
      throw new ApiError(404, UploadMessage.ERROR_UPLOAD_NOT_FOUND);
    }
    return upload;
  },

  async deleteUpload(id: string): Promise<IUploadDocument> {
    const upload = await UploadModel.findById(id);
    if (!upload) {
      throw new ApiError(404, UploadMessage.ERROR_UPLOAD_NOT_FOUND);
    }

    await deleteImage(upload.publicId);
    await UploadModel.findByIdAndDelete(id);

    return upload;
  },
};

export default uploadService;
