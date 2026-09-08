import { BaseEntity } from '../common/interface.js';

/**
 * VoiceChannel Module Types
 */

// VoiceChannel Entity Interface
export interface VoiceChannel extends BaseEntity {
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create VoiceChannel Request
export interface CreateVoiceChannelRequest {
  title: string;
}

// Update VoiceChannel Request
export interface UpdateVoiceChannelRequest {
  title?: string;
}
