/**
 * Custom error classes for application
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed', code = 'AUTH_FAILED') {
    super(message, 401, code);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied', code = 'ACCESS_DENIED') {
    super(message, 403, code);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = {}, code = 'VALIDATION_ERROR') {
    super(message, 400, code);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, 404, code);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', code = 'CONFLICT') {
    super(message, 409, code);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests', retryAfter = 60, code = 'RATE_LIMITED') {
    super(message, 429, code);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class RDPError extends AppError {
  constructor(message = 'RDP connection failed', code = 'RDP_ERROR') {
    super(message, 503, code);
    this.name = 'RDPError';
  }
}

export class SessionError extends AppError {
  constructor(message = 'Session error', code = 'SESSION_ERROR') {
    super(message, 400, code);
    this.name = 'SessionError';
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database error', code = 'DB_ERROR') {
    super(message, 500, code);
    this.name = 'DatabaseError';
  }
}
