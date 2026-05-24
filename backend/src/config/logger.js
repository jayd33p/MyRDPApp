import pino from 'pino';
import fs from 'fs';
import path from 'path';
import configManager from './configManager.js';

/**
 * Logger Configuration - Centralized logging system
 * Handles application logs and audit logs
 */

const logDir = path.dirname(configManager.get('logging.file'));
const auditDir = path.dirname(configManager.get('logging.auditFile'));

// Ensure log directories exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
if (!fs.existsSync(auditDir)) {
  fs.mkdirSync(auditDir, { recursive: true });
}

const pinoConfig = {
  level: configManager.get('logging.level', 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
};

const prettyOption = {
  colorize: !configManager.isProduction(),
  levelFirst: true,
  singleLine: false,
};

// Main application logger
const logger = pino(
  pinoConfig,
  pino.transport({
    targets: [
      {
        level: configManager.get('logging.level', 'info'),
        target: 'pino-pretty',
        options: prettyOption,
      },
      {
        level: 'debug',
        target: 'pino/file',
        options: { destination: configManager.get('logging.file') },
      },
    ],
  })
);

// Audit logger for security events
const auditLogger = pino(
  {
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.transport({
    target: 'pino/file',
    options: { destination: configManager.get('logging.auditFile') },
  })
);

/**
 * Audit log event
 * @param {string} action - Action performed
 * @param {string} userId - User ID
 * @param {string} ipAddress - Client IP address
 * @param {object} details - Additional details
 * @param {string} status - Success or failure
 */
export function logAudit(action, userId, ipAddress, details = {}, status = 'success') {
  auditLogger.info({
    action,
    userId,
    ipAddress,
    status,
    timestamp: new Date().toISOString(),
    ...details,
  });
}

/**
 * Log security event
 * @param {string} event - Event type
 * @param {string} message - Event message
 * @param {object} context - Additional context
 */
export function logSecurityEvent(event, message, context = {}) {
  logger.warn({
    event,
    message,
    ...context,
  });
  auditLogger.warn({
    event,
    message,
    timestamp: new Date().toISOString(),
    ...context,
  });
}

/**
 * Log failed login attempt
 * @param {string} username - Username
 * @param {string} ipAddress - Client IP
 * @param {string} reason - Failure reason
 */
export function logFailedLogin(username, ipAddress, reason) {
  logSecurityEvent('FAILED_LOGIN', `Failed login attempt for user: ${username}`, {
    username,
    ipAddress,
    reason,
  });
}

/**
 * Log successful login
 * @param {string} username - Username
 * @param {string} ipAddress - Client IP
 */
export function logSuccessfulLogin(username, ipAddress) {
  logAudit('LOGIN', username, ipAddress, { action: 'User login' });
}

/**
 * Log successful logout
 * @param {string} username - Username
 * @param {string} ipAddress - Client IP
 */
export function logSuccessfulLogout(username, ipAddress) {
  logAudit('LOGOUT', username, ipAddress, { action: 'User logout' });
}

/**
 * Log session created
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {string} ipAddress - Client IP
 */
export function logSessionCreated(userId, sessionId, ipAddress) {
  logAudit('SESSION_CREATED', userId, ipAddress, {
    sessionId,
    action: 'RDP session created',
  });
}

/**
 * Log session terminated
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {string} ipAddress - Client IP
 * @param {string} reason - Termination reason
 */
export function logSessionTerminated(userId, sessionId, ipAddress, reason = 'User disconnect') {
  logAudit('SESSION_TERMINATED', userId, ipAddress, {
    sessionId,
    reason,
    action: 'RDP session terminated',
  });
}

export default logger;
