import { Router } from 'express';
import serverController from '../controllers/server.controller.js';
import validate from '../middlewares/validate.js';
import { createServerSchema, updateServerSchema } from '../validations/server.validation.js';

const router = Router();

router.get('/', serverController.getAllServers);
router.get('/:id', serverController.getServerById);
router.post('/', validate(createServerSchema), serverController.createServer);
router.patch('/:id', validate(updateServerSchema), serverController.updateServer);
router.delete('/:id', serverController.deleteServer);

export default router;
