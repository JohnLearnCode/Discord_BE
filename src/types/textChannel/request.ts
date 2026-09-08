import { BaseEntity } from '../common/interface.js';

/**
 * TextChannel Module Types
 */

// TextChannel Entity Interface
export interface TextChannel extends BaseEntity {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create TextChannel Request
export interface CreateTextChannelRequest {
  title: string;
}

// Update TextChannel Request
export interface UpdateTextChannelRequest {
  title?: string;
}
