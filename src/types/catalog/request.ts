import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * Catalog Module Types
 */

// Catalog Entity Interface
export interface Catalog extends BaseEntity {
  title: string;
  channelIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create Catalog Request
export interface CreateCatalogRequest {
  title: string;
  channelIds?: string[];
}

// Update Catalog Request
export interface UpdateCatalogRequest {
  title?: string;
  channelIds?: string[];
}
