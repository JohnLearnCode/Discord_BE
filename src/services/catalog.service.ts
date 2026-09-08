import mongoose from 'mongoose';
import CatalogModel, { ICatalogDocument } from '../models/catalog.model.js';
import ApiError from '../utils/ApiError.js';
import { CreateCatalogRequest, UpdateCatalogRequest } from '../types/index.js';

const catalogService = {
  async getAllCatalogs(): Promise<ICatalogDocument[]> {
    return CatalogModel.find();
  },

  async getCatalogById(id: string): Promise<ICatalogDocument> {
    const catalog = await CatalogModel.findById(id);
    if (!catalog) {
      throw new ApiError(404, 'Catalog not found');
    }
    return catalog;
  },

  async createCatalog(data: CreateCatalogRequest): Promise<ICatalogDocument> {
    return CatalogModel.create({
      title: data.title,
      channelIds: (data.channelIds || []).map((id) => new mongoose.Types.ObjectId(id)),
    });
  },

  async updateCatalog(id: string, data: UpdateCatalogRequest): Promise<ICatalogDocument> {
    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.channelIds !== undefined) {
      updateData.channelIds = data.channelIds.map((c) => new mongoose.Types.ObjectId(c));
    }

    const catalog = await CatalogModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!catalog) {
      throw new ApiError(404, 'Catalog not found');
    }

    return catalog;
  },

  async deleteCatalog(id: string): Promise<ICatalogDocument> {
    const catalog = await CatalogModel.findByIdAndDelete(id);
    if (!catalog) {
      throw new ApiError(404, 'Catalog not found');
    }
    return catalog;
  },
};

export default catalogService;
