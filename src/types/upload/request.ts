import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';
import { UploadResourceType } from './enums.js';

/**
 * Upload Module Types
 */

// Upload Entity Interface
export interface Upload extends BaseEntity {
  url: string;
  publicId: string;
  resourceType: UploadResourceType;
  folder: string;
  format: string;
  size: number;
  originalName: string;
  uploaderId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Cloudinary upload result returned by config/cloudinary.ts
export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  format: string;
  size: number;
  resourceType: UploadResourceType;
}
