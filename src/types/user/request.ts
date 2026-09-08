import { ObjectId } from 'mongodb';
import { BaseEntity } from '../common/interface.js';

/**
 * User Module Types
 */

// User Role Enum
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  OWNER = 'owner',
}

// User Entity Interface
export interface User extends BaseEntity {
  username: string;
  email: string;
  passwordHash: string;
  bio: string;
  avatarUrl?: string;
  bannerUrl?: string;
  role: UserRole;
  serverIds?: ObjectId[];
  jointServer?: ObjectId[];
  friends: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Create User Request
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

// Update User Request
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
}
