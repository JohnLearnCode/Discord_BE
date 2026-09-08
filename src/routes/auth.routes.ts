import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import auth from '../middlewares/auth.js';
import validate from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../validations/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/change-password', auth, validate(changePasswordSchema), authController.changePassword);

export default router;
