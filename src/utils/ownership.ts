import ServerModel, { IServerDocument } from '../models/server.model.js';
import CatalogModel from '../models/catalog.model.js';
import ApiError from './ApiError.js';

const OWNER_ONLY_MESSAGE = 'Chỉ chủ sở hữu máy chủ mới có thể thực hiện thao tác này';

/**
 * Ensure the requester is the owner of the given server
 */
export const assertServerOwner = (
  server: IServerDocument | null,
  requesterId: string,
  notFoundMessage = 'Server not found',
): IServerDocument => {
  if (!server) {
    throw new ApiError(404, notFoundMessage);
  }

  if (server.ownerId.toString() !== requesterId) {
    throw new ApiError(403, OWNER_ONLY_MESSAGE);
  }

  return server;
};

/**
 * Find the server that owns a catalog
 */
export const findServerByCatalog = (catalogId: string): Promise<IServerDocument | null> => {
  return ServerModel.findOne({ catalogIds: catalogId });
};

/**
 * Find the server that owns a channel. Channels are referenced either directly
 * on the server or through one of the server's catalogs.
 */
export const findServerByChannel = async (channelId: string): Promise<IServerDocument | null> => {
  const direct = await ServerModel.findOne({ channelIds: channelId });
  if (direct) {
    return direct;
  }

  const catalog = await CatalogModel.findOne({ channelIds: channelId });
  if (!catalog) {
    return null;
  }

  return ServerModel.findOne({ catalogIds: catalog._id });
};
