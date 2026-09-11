import { Router } from 'express';
import uploadController from '../controllers/upload.controller.js';
import auth from '../middlewares/auth.js';
import { uploadSingleImage, uploadMultipleImages } from '../middlewares/uploadMiddleware.js';

const router = Router();

router.use(auth);

router.post('/image', uploadSingleImage('image'), uploadController.uploadSingleImage);
router.post('/images', uploadMultipleImages('images'), uploadController.uploadMultipleImages);
router.delete('/:id', uploadController.deleteUpload);

export default router;
