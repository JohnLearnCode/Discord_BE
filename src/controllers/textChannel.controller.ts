import { NextFunction, Request, Response } from 'express';
import textChannelService from '../services/textChannel.service.js';
import { sendSuccess } from '../utils/response.js';
import { AuthenticatedRequest } from '../middlewares/auth.js';
import { CreateTextChannelRequest, UpdateTextChannelRequest } from '../types/index.js';

const textChannelController = {
  async getAllTextChannels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channels = await textChannelService.getAllTextChannels();
      sendSuccess(res, channels);
    } catch (error) {
      next(error);
    }
  },

  async getTextChannelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await textChannelService.getTextChannelById(req.params.id);
      sendSuccess(res, channel);
    } catch (error) {
      next(error);
    }
  },

  async createTextChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await textChannelService.createTextChannel(req.body as CreateTextChannelRequest);
      sendSuccess(res, channel, 'Text channel created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateTextChannel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      const channel = await textChannelService.updateTextChannel(
        req.params.id,
        req.body as UpdateTextChannelRequest,
        requesterId,
      );
      sendSuccess(res, channel, 'Text channel updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteTextChannel(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requesterId = req.user?.userId;
      if (!requesterId) {
        throw new Error('Unauthenticated');
      }

      await textChannelService.deleteTextChannel(req.params.id, requesterId);
      sendSuccess(res, null, 'Text channel deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default textChannelController;
