import mongoose from 'mongoose';
import ServerModel, { IServerDocument } from '../models/server.model.js';
import User from '../models/user.model.js';
import CatalogModel, { ICatalogDocument } from '../models/catalog.model.js';
import TextChannelModel, { ITextChannelDocument } from '../models/textChannel.model.js';
import VoiceChannelModel, { IVoiceChannelDocument } from '../models/voiceChannel.model.js';
import MessageGroupModel from '../models/messageGroup.model.js';
import ApiError from '../utils/ApiError.js';
import { assertServerOwner } from '../utils/ownership.js';
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

  async getServerChannels(id: string): Promise<{
    catalogs: ICatalogDocument[];
    textChannels: ITextChannelDocument[];
    voiceChannels: IVoiceChannelDocument[];
  }> {
    const server = await ServerModel.findById(id);
    if (!server) {
      throw new ApiError(404, 'Server not found');
    }

    const catalogs = await CatalogModel.find({ _id: { $in: server.catalogIds } });

    const channelIdSet = new Set(server.channelIds.map((cid) => cid.toString()));
    catalogs.forEach((catalog) => {
      catalog.channelIds.forEach((cid) => channelIdSet.add(cid.toString()));
    });
    const channelIds = Array.from(channelIdSet);

    const [textChannels, voiceChannels] = await Promise.all([
      TextChannelModel.find({ _id: { $in: channelIds } }),
      VoiceChannelModel.find({ _id: { $in: channelIds } }),
    ]);

    return { catalogs, textChannels, voiceChannels };
  },

  async searchServers(name: string): Promise<IServerDocument[]> {
    const term = name?.trim();
    if (!term) {
      return [];
    }

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    return ServerModel.find({ name: { $regex: escaped, $options: 'i' } })
      .populate('ownerId', 'username email avatarUrl')
      .limit(20);
  },

  async createServer(data: CreateServerRequest): Promise<IServerDocument> {
    const ownerId = new mongoose.Types.ObjectId(data.ownerId);

    const server = await ServerModel.create({
      name: data.name,
      ownerId,
      iconUrl: data.iconUrl || '',
      memberIds: [ownerId],
    });

    await User.updateOne(
      { _id: ownerId },
      { $addToSet: { serverIds: server._id } },
    );

    return server;
  },

  async joinServer(serverId: string, userId: string): Promise<IServerDocument> {
    const server = await ServerModel.findById(serverId);
    if (!server) {
      throw new ApiError(404, 'Server not found');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const alreadyMember = server.memberIds.some(
      (memberId) => memberId.toString() === user._id.toString(),
    );
    if (alreadyMember) {
      throw new ApiError(409, 'User is already a member of this server');
    }

    await Promise.all([
      User.updateOne({ _id: user._id }, { $addToSet: { jointServer: server._id } }),
      ServerModel.updateOne({ _id: server._id }, { $addToSet: { memberIds: user._id } }),
    ]);

    const updated = await ServerModel.findById(server._id).populate(
      'ownerId',
      'username email avatarUrl',
    );
    if (!updated) {
      throw new ApiError(404, 'Server not found');
    }

    return updated;
  },

  async updateServer(
    id: string,
    data: UpdateServerRequest,
    requesterId: string,
  ): Promise<IServerDocument> {
    assertServerOwner(await ServerModel.findById(id), requesterId);

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

  async deleteServer(id: string, requesterId: string): Promise<IServerDocument> {
    const server = assertServerOwner(await ServerModel.findById(id), requesterId);

    const catalogs = await CatalogModel.find({ _id: { $in: server.catalogIds } });

    const channelIdSet = new Set(server.channelIds.map((cid) => cid.toString()));
    catalogs.forEach((catalog) => {
      catalog.channelIds.forEach((cid) => channelIdSet.add(cid.toString()));
    });
    const channelIds = Array.from(channelIdSet);

    await MessageGroupModel.deleteMany({ channelId: { $in: channelIds } });
    await TextChannelModel.deleteMany({ _id: { $in: channelIds } });
    await VoiceChannelModel.deleteMany({ _id: { $in: channelIds } });
    await CatalogModel.deleteMany({ _id: { $in: server.catalogIds } });
    await ServerModel.findByIdAndDelete(id);

    return server;
  },
};

export default serverService;
