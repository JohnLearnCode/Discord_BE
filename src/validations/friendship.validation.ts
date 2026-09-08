import Joi from 'joi';
import { FriendshipStatus } from '../types/index.js';

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('"{{#label}}" must be a valid ObjectId');

export const createFriendshipSchema = Joi.object({
  senderId: objectIdSchema.required(),
  receiverId: objectIdSchema.required(),
});

export const updateFriendshipSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(FriendshipStatus))
    .required(),
});
