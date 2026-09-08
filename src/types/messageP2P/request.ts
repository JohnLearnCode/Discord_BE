import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * MessageP2P Module Types
 */

// MessageP2P Entity Interface
export interface MessageP2P extends BaseEntity {
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
  imageMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create MessageP2P Request
export interface CreateMessageP2PRequest {
  senderId: string;
  receiverId: string;
  message?: string;
  imageMessage?: string;
}

// Update MessageP2P Request
export interface UpdateMessageP2PRequest {
  message?: string;
  imageMessage?: string;
}
