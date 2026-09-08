import Joi from 'joi';

export const createTextChannelSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
});

export const updateTextChannelSchema = Joi.object({
  title: Joi.string().min(1).max(100),
}).min(1);
