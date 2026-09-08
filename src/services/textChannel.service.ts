import TextChannelModel, { ITextChannelDocument } from '../models/textChannel.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateTextChannelRequest, UpdateTextChannelRequest } from '../types/index.js';

const textChannelService = {
  async getAllTextChannels(): Promise<ITextChannelDocument[]> {
    return TextChannelModel.find();
  },

  async getTextChannelById(id: string): Promise<ITextChannelDocument> {
    const channel = await TextChannelModel.findById(id);
    if (!channel) {
      throw new ApiError(404, 'Text channel not found');
    }
    return channel;
  },

  async createTextChannel(data: CreateTextChannelRequest): Promise<ITextChannelDocument> {
    return TextChannelModel.create({
      title: data.title,
    });
  },

  async updateTextChannel(id: string, data: UpdateTextChannelRequest): Promise<ITextChannelDocument> {
    const channel = await TextChannelModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!channel) {
      throw new ApiError(404, 'Text channel not found');
    }

    return channel;
  },

  async deleteTextChannel(id: string): Promise<ITextChannelDocument> {
    const channel = await TextChannelModel.findByIdAndDelete(id);
    if (!channel) {
      throw new ApiError(404, 'Text channel not found');
    }
    return channel;
  },
};

export default textChannelService;
