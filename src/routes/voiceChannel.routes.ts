import { Router } from 'express';
import voiceChannelController from '../controllers/voiceChannel.controller.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import { createVoiceChannelSchema, updateVoiceChannelSchema } from '../validations/voiceChannel.validation.js';

const router = Router();

router.get('/', voiceChannelController.getAllVoiceChannels);
router.get('/:id', voiceChannelController.getVoiceChannelById);
router.post('/', validate(createVoiceChannelSchema), voiceChannelController.createVoiceChannel);
router.patch('/:id', auth, validate(updateVoiceChannelSchema), voiceChannelController.updateVoiceChannel);
router.delete('/:id', auth, voiceChannelController.deleteVoiceChannel);

export default router;
