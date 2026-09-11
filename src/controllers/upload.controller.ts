import { NextFunction, Request, Response } from 'express';
import { uploadImage as uploadImageToCloudinary, uploadMultipleImages as uploadMultipleToCloudinary } from '../config/cloudinary.js';
import { bufferToBase64 } from '../middlewares/uploadMiddleware.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import uploadService from '../services/upload.service.js';
import { sendSuccess } from '../utils/response.js';
import { BadRequestError } from '../utils/ApiError.js';
import { UploadMessage, UploadErrorCode } from '../types/upload/enums.js';

const uploadController = {
  async uploadSingleImage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError(UploadMessage.ERROR_NO_FILE, UploadErrorCode.NO_FILE);
      }

      const base64Image = bufferToBase64(req.file.buffer, req.file.mimetype);
      const result = await uploadImageToCloudinary(base64Image, 'images');

      const record = await uploadService.createUpload({
        url: result.url,
        publicId: result.publicId,
        resourceType: result.resourceType,
        folder: 'images',
        format: result.format,
        size: result.size,
        originalName: req.file.originalname,
        uploaderId: req.user!.userId,
      });

      sendSuccess(res, record, UploadMessage.SUCCESS_UPLOAD_IMAGE, 201);
    } catch (error) {
      next(error);
    }
  },

  async uploadMultipleImages(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new BadRequestError(UploadMessage.ERROR_NO_FILE, UploadErrorCode.NO_FILE);
      }

      const base64Images = files.map(file => bufferToBase64(file.buffer, file.mimetype));
      const results = await uploadMultipleToCloudinary(base64Images, 'images');

      const records = await Promise.all(
        results.map((result, index) =>
          uploadService.createUpload({
            url: result.url,
            publicId: result.publicId,
            resourceType: result.resourceType,
            folder: 'images',
            format: result.format,
            size: result.size,
            originalName: files[index].originalname,
            uploaderId: req.user!.userId,
          }),
        ),
      );

      sendSuccess(res, records, UploadMessage.SUCCESS_UPLOAD_IMAGE, 201);
    } catch (error) {
      next(error);
    }
  },

  async deleteUpload(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await uploadService.deleteUpload(req.params.id);
      sendSuccess(res, record, UploadMessage.SUCCESS_DELETE_UPLOAD);
    } catch (error) {
      next(error);
    }
  },
};

export default uploadController;
