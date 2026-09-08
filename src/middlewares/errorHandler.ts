import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendError } from '../utils/response.js';

interface MongoServerError extends Error {
  code?: number;
}

const NODE_ENV = process.env.NODE_ENV || 'development';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = (err as { statusCode?: number }).statusCode ?? 500;
  const errorCode = (err as { errorCode?: string }).errorCode;
  let message = err.message;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = 'Invalid id format';
  }

  if ((err as MongoServerError).code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value';
  }

  if (NODE_ENV === 'development' && statusCode >= 500) {
    console.error(err.stack);
  }

  sendError(res, message || 'Internal Server Error', statusCode, undefined, errorCode);
};

export default errorHandler;
