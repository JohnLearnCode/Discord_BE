import { NextFunction, Request, Response } from 'express';
import { extractTokenFromHeader, verifyAccessToken, JwtPayload } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import ApiError from '../utils/ApiError.js';

/**
 * Extend Express Request to carry authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware: verify Bearer access token, attach payload to req.user
 */
const auth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new ApiError(401, 'Access token is required');
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      sendError(res, error.message, error.statusCode);
      return;
    }
    sendError(res, 'Invalid or expired access token', 401);
  }
};

export default auth;
