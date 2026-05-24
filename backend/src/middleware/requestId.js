import { generateRequestId } from '../utils/helpers.js';

/**
 * Request ID middleware - Adds unique ID to each request for tracking
 */
export function requestIdMiddleware(req, res, next) {
  req.id = req.headers['x-request-id'] || generateRequestId();
  res.setHeader('X-Request-ID', req.id);
  next();
}
