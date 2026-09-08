import Joi from 'joi';

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('"{{#label}}" must be a valid ObjectId');

export const createMessageGroupSchema = Joi.object({
  senderId: objectIdSchema.required(),
  channelId: objectIdSchema.required(),
  message: Joi.string().allow(''),
  imageMessage: Joi.string().allow(''),
}).or('message', 'imageMessage');

export const updateMessageGroupSchema = Joi.object({
  message: Joi.string().allow(''),
  imageMessage: Joi.string().allow(''),
}).min(1);
