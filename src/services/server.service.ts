import mongoose from 'mongoose';
import ServerModel, { IServerDocument } from '../models/server.model.js';
import CatalogModel from '../models/catalog.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateServerRequest, UpdateServerRequest } from '../types/index.js';

const serverService = {
  async getAllServers(): Promise<IServerDocument[]> {
    return ServerModel.find().populate('ownerId', 'username email avatarUrl');
  },

  async getServerById(id: string): Promise<IServerDocument> {
    const server = await ServerModel.findById(id).populate('ownerId', 'username email avatarUrl');
    if (!server) {
      throw new ApiError(404, 'Server not found');
    }
    return server;
  },

  async createServer(data: CreateServerRequest): Promise<IServerDocument> {
    const ownerId = new mongoose.Types.ObjectId(data.ownerId);

    return ServerModel.create({
      name: data.name,
      ownerId,
      iconUrl: data.iconUrl || '',
      memberIds: [ownerId],
    });
  },

  async updateServer(id: string, data: UpdateServerRequest): Promise<IServerDocument> {
    const updateData: Record<string, unknown> = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.iconUrl !== undefined) updateData.iconUrl = data.iconUrl;
    if (data.memberIds !== undefined) {
      updateData.memberIds = data.memberIds.map((m) => new mongoose.Types.ObjectId(m));
    }
    if (data.channelIds !== undefined) {
      updateData.channelIds = data.channelIds.map((c) => new mongoose.Types.ObjectId(c));
    }
    if (data.catalogIds !== undefined) {
      updateData.catalogIds = data.catalogIds.map((c) => new mongoose.Types.ObjectId(c));
    }

    const server = await ServerModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!server) {
      throw new ApiError(404, 'Server not found');
    }

    return server;
  },

  async deleteServer(id: string): Promise<IServerDocument> {
    const server = await ServerModel.findByIdAndDelete(id);
    if (!server) {
      throw new ApiError(404, 'Server not found');
    }

    await CatalogModel.deleteMany({ _id: { $in: server.catalogIds } });

    return server;
  },
};

export default serverService;
