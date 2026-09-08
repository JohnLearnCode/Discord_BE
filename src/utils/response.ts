import { Response } from 'express';
import { ApiResponse } from '../types/index.js';

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  error?: string,
  errorCode?: string,
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    error,
    errorCode,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
};
