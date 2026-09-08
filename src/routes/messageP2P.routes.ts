import { Router } from 'express';
import messageP2PController from '../controllers/messageP2P.controller.js';
import validate from '../middlewares/validate.js';
import { createMessageP2PSchema, updateMessageP2PSchema } from '../validations/messageP2P.validation.js';

const router = Router();

router.get('/', messageP2PController.getAllMessages);
router.get('/conversation', messageP2PController.getConversation);
router.get('/:id', messageP2PController.getMessageById);
router.post('/', validate(createMessageP2PSchema), messageP2PController.createMessage);
router.patch('/:id', validate(updateMessageP2PSchema), messageP2PController.updateMessage);
router.delete('/:id', messageP2PController.deleteMessage);

export default router;
