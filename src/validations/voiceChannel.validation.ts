import Joi from 'joi';

export const createVoiceChannelSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
});

export const updateVoiceChannelSchema = Joi.object({
  title: Joi.string().min(1).max(100),
}).min(1);
