import { Router } from 'express';
import friendshipController from '../controllers/friendship.controller.js';
import validate from '../middlewares/validate.js';
import { createFriendshipSchema, updateFriendshipSchema } from '../validations/friendship.validation.js';

const router = Router();

router.get('/', friendshipController.getAllFriendships);
router.get('/user/:userId', friendshipController.getFriendshipsByUser);
router.get('/:id', friendshipController.getFriendshipById);
router.post('/', validate(createFriendshipSchema), friendshipController.sendFriendRequest);
router.patch('/:id', validate(updateFriendshipSchema), friendshipController.respondFriendRequest);
router.delete('/:id', friendshipController.deleteFriendship);

export default router;
