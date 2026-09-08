import { NextFunction, Request, Response } from 'express';
import messageGroupService from '../services/messageGroup.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateMessageGroupRequest, UpdateMessageGroupRequest } from '../types/index.js';

const messageGroupController = {
  async getAllMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await messageGroupService.getAllMessages();
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async getMessageById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageGroupService.getMessageById(req.params.id);
      sendSuccess(res, message);
    } catch (error) {
      next(error);
    }
  },

  async getMessagesByChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await messageGroupService.getMessagesByChannel(req.params.channelId);
      sendSuccess(res, messages);
    } catch (error) {
      next(error);
    }
  },

  async createMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageGroupService.createMessage(req.body as CreateMessageGroupRequest);
      sendSuccess(res, message, 'Message sent successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const message = await messageGroupService.updateMessage(
        req.params.id,
        req.body as UpdateMessageGroupRequest,
      );
      sendSuccess(res, message, 'Message updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await messageGroupService.deleteMessage(req.params.id);
      sendSuccess(res, null, 'Message deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default messageGroupController;
