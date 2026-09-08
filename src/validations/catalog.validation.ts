import Joi from 'joi';

const objectIdSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).message('"{{#label}}" must be a valid ObjectId');

export const createCatalogSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  channelIds: Joi.array().items(objectIdSchema),
});

export const updateCatalogSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  channelIds: Joi.array().items(objectIdSchema),
}).min(1);
