import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * Server Module Types
 */

// Server Entity Interface
export interface Server extends BaseEntity {
  name: string;
  ownerId: ObjectId;
  iconUrl: string;
  memberIds: ObjectId[];
  channelIds: ObjectId[];
  catalogIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create Server Request
export interface CreateServerRequest {
  name: string;
  ownerId: string;
  iconUrl?: string;
}

// Update Server Request
export interface UpdateServerRequest {
  name?: string;
  iconUrl?: string;
  memberIds?: string[];
  channelIds?: string[];
  catalogIds?: string[];
}
