import Joi from 'joi';

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('"{{#label}}" must be a valid ObjectId');

export const createMessageP2PSchema = Joi.object({
  senderId: objectIdSchema.required(),
  receiverId: objectIdSchema.required(),
  message: Joi.string().allow(''),
  imageMessage: Joi.string().allow(''),
}).or('message', 'imageMessage');

export const updateMessageP2PSchema = Joi.object({
  message: Joi.string().allow(''),
  imageMessage: Joi.string().allow(''),
}).min(1);
