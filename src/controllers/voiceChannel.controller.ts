import { NextFunction, Request, Response } from 'express';
import voiceChannelService from '../services/voiceChannel.service.js';
import { sendSuccess } from '../utils/response.js';
import { CreateVoiceChannelRequest, UpdateVoiceChannelRequest } from '../types/index.js';

const voiceChannelController = {
  async getAllVoiceChannels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channels = await voiceChannelService.getAllVoiceChannels();
      sendSuccess(res, channels);
    } catch (error) {
      next(error);
    }
  },

  async getVoiceChannelById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await voiceChannelService.getVoiceChannelById(req.params.id);
      sendSuccess(res, channel);
    } catch (error) {
      next(error);
    }
  },

  async createVoiceChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await voiceChannelService.createVoiceChannel(req.body as CreateVoiceChannelRequest);
      sendSuccess(res, channel, 'Voice channel created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  async updateVoiceChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const channel = await voiceChannelService.updateVoiceChannel(
        req.params.id,
        req.body as UpdateVoiceChannelRequest,
      );
      sendSuccess(res, channel, 'Voice channel updated successfully');
    } catch (error) {
      next(error);
    }
  },

  async deleteVoiceChannel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await voiceChannelService.deleteVoiceChannel(req.params.id);
      sendSuccess(res, null, 'Voice channel deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};

export default voiceChannelController;
