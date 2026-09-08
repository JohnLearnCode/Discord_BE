import MessageGroupModel, { IMessageGroupDocument } from '../models/messageGroup.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateMessageGroupRequest, UpdateMessageGroupRequest } from '../types/index.js';

const messageGroupService = {
  async getAllMessages(): Promise<IMessageGroupDocument[]> {
    return MessageGroupModel.find().populate('senderId', 'username email avatarUrl');
  },

  async getMessageById(id: string): Promise<IMessageGroupDocument> {
    const message = await MessageGroupModel.findById(id).populate('senderId', 'username email avatarUrl');
    if (!message) {
      throw new ApiError(404, 'Message not found');
    }
    return message;
  },

  async getMessagesByChannel(channelId: string): Promise<IMessageGroupDocument[]> {
    return MessageGroupModel.find({ channelId })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username email avatarUrl');
  },

  async createMessage(data: CreateMessageGroupRequest): Promise<IMessageGroupDocument> {
    if (!data.message && !data.imageMessage) {
      throw new ApiError(400, 'Message or imageMessage is required');
    }

    return MessageGroupModel.create({
      senderId: data.senderId,
      channelId: data.channelId,
      message: data.message || '',
      imageMessage: data.imageMessage || '',
    });
  },

  async updateMessage(id: string, data: UpdateMessageGroupRequest): Promise<IMessageGroupDocument> {
    const message = await MessageGroupModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!message) {
      throw new ApiError(404, 'Message not found');
    }

    return message;
  },

  async deleteMessage(id: string): Promise<IMessageGroupDocument> {
    const message = await MessageGroupModel.findByIdAndDelete(id);
    if (!message) {
      throw new ApiError(404, 'Message not found');
    }
    return message;
  },
};

export default messageGroupService;
