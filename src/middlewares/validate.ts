import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { sendError } from '../utils/response.js';

const validate = (schema: Joi.ObjectSchema) => (req: Request, res: Response, next: NextFunction): void => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    sendError(res, message, 400);
    return;
  }

  next();
};

export default validate;
