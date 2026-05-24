import logger from '../config/logger.js';
import { AppError, ValidationError } from '../utils/errors.js';
import { getClientIp } from '../utils/helpers.js';

/**
 * Global error handling middleware
 * @param {Error} err - Error object
 * @param {object} req - Express request
 * @param {object} res - Express response
 * @param {function} next - Next middleware
 */
export function errorHandler(err, req, res, next) {
  const clientIp = getClientIp(req);
  const requestId = req.id || 'unknown';

  // Log error
  if (err instanceof AppError) {
    logger.warn(
      {
        requestId,
        clientIp,
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        code: err.code,
      },
      `${err.name}: ${err.message}`
    );
  } else {
    logger.error(
      {
        requestId,
        clientIp,
        path: req.path,
        method: req.method,
        stack: err.stack,
      },
      `Unexpected error: ${err.message}`
    );
  }

  // Handle specific error types
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      errors: err.errors,
      requestId,
    });
  }

  if (err instanceof AppError) {
    const response = {
      success: false,
      code: err.code,
      message: err.message,
      requestId,
    };

    if (err.name === 'RateLimitError') {
      res.set('Retry-After', err.retryAfter);
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle unexpected errors
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    code: 'INTERNAL_ERROR',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    requestId,
  };

  res.status(statusCode).json(response);
}

/**
 * 404 Not Found middleware
 * @param {object} req - Express request
 * @param {object} res - Express response
 */
export function notFoundHandler(req, res) {
  const clientIp = getClientIp(req);
  const requestId = req.id || 'unknown';

  logger.debug(
    {
      requestId,
      clientIp,
      path: req.path,
      method: req.method,
    },
    'Route not found'
  );

  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: 'Endpoint not found',
    requestId,
  });
}
