import VoiceChannelModel, { IVoiceChannelDocument } from '../models/voiceChannel.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateVoiceChannelRequest, UpdateVoiceChannelRequest } from '../types/index.js';

const voiceChannelService = {
  async getAllVoiceChannels(): Promise<IVoiceChannelDocument[]> {
    return VoiceChannelModel.find();
  },

  async getVoiceChannelById(id: string): Promise<IVoiceChannelDocument> {
    const channel = await VoiceChannelModel.findById(id);
    if (!channel) {
      throw new ApiError(404, 'Voice channel not found');
    }
    return channel;
  },

  async createVoiceChannel(data: CreateVoiceChannelRequest): Promise<IVoiceChannelDocument> {
    return VoiceChannelModel.create({
      title: data.title,
    });
  },

  async updateVoiceChannel(id: string, data: UpdateVoiceChannelRequest): Promise<IVoiceChannelDocument> {
    const channel = await VoiceChannelModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!channel) {
      throw new ApiError(404, 'Voice channel not found');
    }

    return channel;
  },

  async deleteVoiceChannel(id: string): Promise<IVoiceChannelDocument> {
    const channel = await VoiceChannelModel.findByIdAndDelete(id);
    if (!channel) {
      throw new ApiError(404, 'Voice channel not found');
    }
    return channel;
  },
};

export default voiceChannelService;
