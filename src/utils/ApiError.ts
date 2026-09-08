/**
 * Custom Application Error with status code
 * Base class for all application errors
 */
class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    errorCode: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 400 Bad Request - Invalid input/validation errors
 */
export class BadRequestError extends ApiError {
  constructor(message: string, errorCode: string = 'BAD_REQUEST') {
    super(400, message, errorCode);
  }
}

/**
 * 401 Unauthorized - Authentication required
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string, errorCode: string = 'UNAUTHORIZED') {
    super(401, message, errorCode);
  }
}

/**
 * 403 Forbidden - Insufficient permissions
 */
export class ForbiddenError extends ApiError {
  constructor(message: string, errorCode: string = 'FORBIDDEN') {
    super(403, message, errorCode);
  }
}

/**
 * 404 Not Found - Resource not found
 */
export class NotFoundError extends ApiError {
  constructor(message: string, errorCode: string = 'NOT_FOUND') {
    super(404, message, errorCode);
  }
}

/**
 * 409 Conflict - Resource conflict (duplicate, etc)
 */
export class ConflictError extends ApiError {
  constructor(message: string, errorCode: string = 'CONFLICT') {
    super(409, message, errorCode);
  }
}

/**
 * 500 Internal Server Error - Unexpected errors
 */
export class InternalServerError extends ApiError {
  constructor(message: string, errorCode: string = 'INTERNAL_SERVER_ERROR') {
    super(500, message, errorCode);
  }
}

export default ApiError;
