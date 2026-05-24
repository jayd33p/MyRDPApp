import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate unique session ID
 * @returns {string} Session ID
 */
export function generateSessionId() {
  return `sess_${uuidv4()}`;
}

/**
 * Generate unique request ID
 * @returns {string} Request ID
 */
export function generateRequestId() {
  return `req_${uuidv4()}`;
}

/**
 * Generate unique user ID
 * @returns {string} User ID
 */
export function generateUserId() {
  return `user_${uuidv4()}`;
}

/**
 * Generate random string
 * @param {number} length - String length
 * @returns {string} Random string
 */
export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash data using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} Hash
 */
export function hashData(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Get client IP address from request
 * @param {object} req - Express request object
 * @returns {string} IP address
 */
export function getClientIp(req) {
  return (
    (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    'unknown'
  );
}

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} Is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Windows username format
 * @param {string} username - Username
 * @returns {boolean} Is valid
 */
export function isValidWindowsUsername(username) {
  // Windows username rules: 1-20 chars, can't contain certain chars
  const invalidChars = /["\/<>:|?*\\]/;
  return username && username.length > 0 && username.length <= 20 && !invalidChars.test(username);
}

/**
 * Delay execution (for testing/retries)
 * @param {number} ms - Milliseconds
 * @returns {Promise} Resolved after delay
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert bytes to human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Convert milliseconds to human-readable format
 * @param {number} ms - Milliseconds
 * @returns {string} Formatted duration
 */
export function formatDuration(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

/**
 * Check if object is empty
 * @param {object} obj - Object to check
 * @returns {boolean} Is empty
 */
export function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Merge objects deeply
 * @param {object} target - Target object
 * @param {...object} sources - Source objects
 * @returns {object} Merged object
 */
export function deepMerge(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (typeof target === 'object' && typeof source === 'object') {
    for (const key in source) {
      if (typeof source[key] === 'object') {
        if (!(key in target)) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}
