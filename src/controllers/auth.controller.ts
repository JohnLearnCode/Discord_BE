import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import {
  AuthMessage,
  ChangePasswordRequest,
  LoginUserRequest,
  RegisterUserRequest,
  RefreshTokenRequest,
} from '../types/index.js';

const authController = {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await authService.register(req.body as RegisterUserRequest);
      sendSuccess(res, authResponse, AuthMessage.SUCCESS_CREATE, 201);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authResponse = await authService.login(req.body as LoginUserRequest);
      sendSuccess(res, authResponse, AuthMessage.SUCCESS_LOGIN);
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body as RefreshTokenRequest;
      const authResponse = await authService.refreshToken(refreshToken);
      sendSuccess(res, authResponse);
    } catch (error) {
      next(error);
    }
  },

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('Unauthenticated');
      }
      await authService.changePassword(userId, req.body as ChangePasswordRequest);
      sendSuccess(res, null, AuthMessage.SUCCESS_CHANGEPASSWORD);
    } catch (error) {
      next(error);
    }
  },
};

export default authController;
