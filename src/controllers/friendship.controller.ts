import { NextFunction, Request, Response } from 'express';
import friendshipService from '../services/friendship.service.js';
import { getIO } from '../config/socket.js';
import { sendSuccess } from '../utils/response.js';
import { CreateFriendshipRequest, UpdateFriendshipRequest } from '../types/index.js';

function toId(value: unknown): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  const populated = value as { _id?: unknown };
  return populated._id ? String(populated._id) : String(value);
}

function userRoom(id: string): string {
  return `user:${id}`;
}

function friendRooms(senderId: unknown, receiverId: unknown): string[] {
  return [userRoom(toId(senderId)), userRoom(toId(receiverId))];
}

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
      getIO()?.to(userRoom(toId(friendship.receiverId))).emit('friendship:request', friendship);
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
      getIO()
        ?.to(friendRooms(friendship.senderId, friendship.receiverId))
        .emit('friendship:updated', friendship);
      sendSuccess(res, friendship, 'Friend request updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteFriendship(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const friendship = await friendshipService.deleteFriendship(req.params.id);
      getIO()
        ?.to(friendRooms(friendship.senderId, friendship.receiverId))
        .emit('friendship:removed', {
          _id: friendship._id,
          senderId: friendship.senderId,
          receiverId: friendship.receiverId,
          status: friendship.status,
        });
      sendSuccess(res, null, 'Friendship deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default friendshipController;
