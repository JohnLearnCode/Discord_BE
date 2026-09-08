import MessageP2PModel, { IMessageP2PDocument } from '../models/messageP2P.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateMessageP2PRequest, UpdateMessageP2PRequest } from '../types/index.js';

const messageP2PService = {
  async getAllMessages(): Promise<IMessageP2PDocument[]> {
    return MessageP2PModel.find().populate('senderId', 'username email avatarUrl').populate('receiverId', 'username email avatarUrl');
  },

  async getMessageById(id: string): Promise<IMessageP2PDocument> {
    const message = await MessageP2PModel.findById(id)
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl');
    if (!message) {
      throw new ApiError(404, 'Message not found');
    }
    return message;
  },

  async getConversation(userId1: string, userId2: string): Promise<IMessageP2PDocument[]> {
    return MessageP2PModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('senderId', 'username email avatarUrl')
      .populate('receiverId', 'username email avatarUrl');
  },

  async createMessage(data: CreateMessageP2PRequest): Promise<IMessageP2PDocument> {
    if (!data.message && !data.imageMessage) {
      throw new ApiError(400, 'Message or imageMessage is required');
    }

    return MessageP2PModel.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      message: data.message || '',
      imageMessage: data.imageMessage || '',
    });
  },

  async updateMessage(id: string, data: UpdateMessageP2PRequest): Promise<IMessageP2PDocument> {
    const message = await MessageP2PModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!message) {
      throw new ApiError(404, 'Message not found');
    }

    return message;
  },

  async deleteMessage(id: string): Promise<IMessageP2PDocument> {
    const message = await MessageP2PModel.findByIdAndDelete(id);
    if (!message) {
      throw new ApiError(404, 'Message not found');
    }
    return message;
  },
};

export default messageP2PService;
