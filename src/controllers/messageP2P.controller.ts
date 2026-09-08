import { NextFunction, Request, Response } from 'express';
import messageP2PService from '../services/messageP2P.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateMessageP2PRequest, UpdateMessageP2PRequest } from '../types/index.js';

const messageP2PController = {
  async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await messageP2PService.getAllMessages();
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async getMessageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageP2PService.getMessageById(req.params.id);
      sendSuccess(res, message);
    } catch (error) {
      next(error);
    }
  },

  async getConversation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId1, userId2 } = req.query;
      const messages = await messageP2PService.getConversation(
        String(userId1),
        String(userId2),
      );
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageP2PService.createMessage(req.body as CreateMessageP2PRequest);
      sendSuccess(res, message, 'Message sent successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageP2PService.updateMessage(
        req.params.id,
        req.body as UpdateMessageP2PRequest,
      );
      sendSuccess(res, message, 'Message updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await messageP2PService.deleteMessage(req.params.id);
      sendSuccess(res, null, 'Message deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default messageP2PController;
