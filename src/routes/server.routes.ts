import { Router } from 'express';
import serverController from '../controllers/server.controller.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  createServerSchema,
  joinServerSchema,
  updateServerSchema,
} from '../validations/server.validation.js';

const router = Router();

router.get('/', serverController.getAllServers);
router.get('/search', serverController.searchServers);
router.get('/:id/channels', serverController.getServerChannels);
router.get('/:id', serverController.getServerById);
router.post('/', validate(createServerSchema), serverController.createServer);
router.post('/:id/join', validate(joinServerSchema), serverController.joinServer);
router.patch('/:id', auth, validate(updateServerSchema), serverController.updateServer);
router.delete('/:id', auth, serverController.deleteServer);

export default router;
