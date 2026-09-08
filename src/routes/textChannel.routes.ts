import { Router } from 'express';
import textChannelController from '../controllers/textChannel.controller.js';
import validate from '../middlewares/validate.js';
import { createTextChannelSchema, updateTextChannelSchema } from '../validations/textChannel.validation.js';

const router = Router();

router.get('/', textChannelController.getAllTextChannels);
router.get('/:id', textChannelController.getTextChannelById);
router.post('/', validate(createTextChannelSchema), textChannelController.createTextChannel);
router.patch('/:id', validate(updateTextChannelSchema), textChannelController.updateTextChannel);
router.delete('/:id', textChannelController.deleteTextChannel);

export default router;
