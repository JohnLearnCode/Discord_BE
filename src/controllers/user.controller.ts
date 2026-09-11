import { NextFunction, Request, Response } from 'express';
import userService from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateUserRequest, UpdateUserRequest } from '../types/index.js';

const userController = {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers();
      sendSuccess(res, users);
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  async getUserByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.findUserByUsername(req.params.username);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  async searchUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const username = typeof req.query.username === 'string' ? req.query.username : '';
      const users = await userService.searchUserByUsername(username);
      sendSuccess(res, users, 'Users searched successfully');
    } catch (error) {
      next(error);
    }
  },

  async getFriends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friends = await userService.getFriends(req.params.userId);
      sendSuccess(res, friends, 'Friends fetched successfully');
    } catch (error) {
      next(error);
    }
  },

  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body as CreateUserRequest);
      sendSuccess(res, user, 'User created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body as UpdateUserRequest);
      sendSuccess(res, user, 'User updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await userService.deleteUser(req.params.id);
      sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default userController;
