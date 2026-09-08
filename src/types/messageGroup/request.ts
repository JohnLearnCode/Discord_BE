import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * MessageGroup Module Types
 */

// MessageGroup Entity Interface
export interface MessageGroup extends BaseEntity {
  senderId: ObjectId;
  channelId: ObjectId;
  message: string;
  imageMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create MessageGroup Request
export interface CreateMessageGroupRequest {
  senderId: string;
  channelId: string;
  message?: string;
  imageMessage?: string;
}

// Update MessageGroup Request
export interface UpdateMessageGroupRequest {
  message?: string;
  imageMessage?: string;
}
