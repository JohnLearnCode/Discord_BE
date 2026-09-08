import { Router } from 'express';
import messageGroupController from '../controllers/messageGroup.controller.js';
import validate from '../middlewares/validate.js';
import { createMessageGroupSchema, updateMessageGroupSchema } from '../validations/messageGroup.validation.js';

const router = Router();

router.get('/', messageGroupController.getAllMessages);
router.get('/channel/:channelId', messageGroupController.getMessagesByChannel);
router.get('/:id', messageGroupController.getMessageById);
router.post('/', validate(createMessageGroupSchema), messageGroupController.createMessage);
router.patch('/:id', validate(updateMessageGroupSchema), messageGroupController.updateMessage);
router.delete('/:id', messageGroupController.deleteMessage);

export default router;
