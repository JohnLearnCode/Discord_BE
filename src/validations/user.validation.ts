import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(32).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avatar: Joi.string().uri().allow(''),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(32),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  avatar: Joi.string().uri().allow(''),
}).min(1);
