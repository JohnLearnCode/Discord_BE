import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import validate from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema } from '../validations/user.validation.js';

const router = Router();

router.get('/', userController.getAllUsers);
router.get('/username/:username', userController.getUserByUsername);
router.get('/search', userController.searchUsers);
router.get('/:userId/friends', userController.getFriends);
router.get('/:id', userController.getUserById);
router.post('/', validate(createUserSchema), userController.createUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
