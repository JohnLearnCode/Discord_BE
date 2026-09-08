import { NextFunction, Request, Response } from 'express';
import friendshipService from '../services/friendship.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateFriendshipRequest, UpdateFriendshipRequest } from '../types/index.js';

const friendshipController = {
  async getAllFriendships(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendships = await friendshipService.getAllFriendships();
      sendSuccess(res, friendships);
    } catch (error) {
      next(error);
    }
  },

  async getFriendshipById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendship = await friendshipService.getFriendshipById(req.params.id);
      sendSuccess(res, friendship);
    } catch (error) {
      next(error);
    }
  },

  async getFriendshipsByUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendships = await friendshipService.getFriendshipsByUser(req.params.userId);
      sendSuccess(res, friendships);
    } catch (error) {
      next(error);
    }
  },

  async sendFriendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendship = await friendshipService.sendFriendRequest(req.body as CreateFriendshipRequest);
      sendSuccess(res, friendship, 'Friend request sent successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async respondFriendRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendship = await friendshipService.respondFriendRequest(
        req.params.id,
        req.body as UpdateFriendshipRequest,
      );
      sendSuccess(res, friendship, 'Friend request updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteFriendship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await friendshipService.deleteFriendship(req.params.id);
      sendSuccess(res, null, 'Friendship deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default friendshipController;
