import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * Friendship Module Types
 */

// Friendship Status Enum
export enum FriendshipStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// Friendship Entity Interface
export interface Friendship extends BaseEntity {
  senderId: ObjectId;
  receiverId: ObjectId;
  status: FriendshipStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Create Friendship Request (send request)
export interface CreateFriendshipRequest {
  senderId: string;
  receiverId: string;
}

// Update Friendship Request (accept/reject)
export interface UpdateFriendshipRequest {
  status: FriendshipStatus;
}
