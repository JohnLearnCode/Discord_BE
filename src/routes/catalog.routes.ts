import { Router } from 'express';
import catalogController from '../controllers/catalog.controller.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createCatalogSchema, updateCatalogSchema } from '../validations/catalog.validation.js';

const router = Router();

router.get('/', catalogController.getAllCatalogs);
router.get('/:id', catalogController.getCatalogById);
router.post('/', validate(createCatalogSchema), catalogController.createCatalog);
router.patch('/:id', auth, validate(updateCatalogSchema), catalogController.updateCatalog);
router.delete('/:id', auth, catalogController.deleteCatalog);

export default router;