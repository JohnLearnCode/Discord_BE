import Joi from 'joi';

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('"{{#label}}" must be a valid ObjectId');

export const createServerSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  ownerId: objectIdSchema.required(),
  iconUrl: Joi.string().uri().allow(''),
});

export const updateServerSchema = Joi.object({
  name: Joi.string().min(1).max(100),
  iconUrl: Joi.string().uri().allow(''),
  memberIds: Joi.array().items(objectIdSchema),
  channelIds: Joi.array().items(objectIdSchema),
  catalogIds: Joi.array().items(objectIdSchema),
}).min(1);
