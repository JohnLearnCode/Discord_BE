import { Router } from 'express';
import catalogController from '../controllers/catalog.controller.js';
import validate from '../middlewares/validate.js';
import { createCatalogSchema, updateCatalogSchema } from '../validations/catalog.validation.js';

const router = Router();

router.get('/', catalogController.getAllCatalogs);
router.get('/:id', catalogController.getCatalogById);
router.post('/', validate(createCatalogSchema), catalogController.createCatalog);
router.patch('/:id', validate(updateCatalogSchema), catalogController.updateCatalog);
router.delete('/:id', catalogController.deleteCatalog);

export default router;
