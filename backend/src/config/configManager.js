import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

/**
 * Configuration Manager - Centralized configuration system
 * Handles environment variables, validation, and defaults
 */
class ConfigManager {
  constructor() {
    this.config = {};
    this.loadConfiguration();
    this.validateConfiguration();
  }

  loadConfiguration() {
    // Server Configuration
    this.config.server = {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT || '8443', 10),
      host: process.env.HOST || '0.0.0.0',
      https: process.env.HTTPS === 'true',
      ssl: {
        keyPath: process.env.SSL_KEY_PATH || './certs/key.pem',
        certPath: process.env.SSL_CERT_PATH || './certs/cert.pem',
        caPath: process.env.SSL_CA_PATH || null,
      },
    };

    // Database Configuration
    this.config.database = {
      type: process.env.DB_TYPE || 'sqlite',
      path: process.env.DB_PATH || './data/app.db',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      name: process.env.DB_NAME || 'myrdpapp',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
    };

    // RDP Configuration
    this.config.rdp = {
      host: process.env.RDP_HOST || 'localhost',
      port: parseInt(process.env.RDP_PORT || '3389', 10),
      enableAudio: process.env.RDP_ENABLE_AUDIO === 'true',
      enableClipboard: process.env.RDP_ENABLE_CLIPBOARD === 'true',
      enableFileTransfer: process.env.RDP_ENABLE_FILE_TRANSFER === 'true',
      frameRate: parseInt(process.env.RDP_FRAME_RATE || '30', 10),
      quality: parseInt(process.env.RDP_QUALITY || '90', 10),
    };

    // Authentication Configuration
    this.config.auth = {
      type: process.env.AUTH_TYPE || 'windows',
      ldap: {
        server: process.env.LDAP_SERVER || 'ldap://localhost:389',
        baseDn: process.env.LDAP_BASE_DN || '',
        bindDn: process.env.LDAP_BIND_DN || '',
        bindPassword: process.env.LDAP_BIND_PASSWORD || '',
      },
    };

    // Session Management
    this.config.session = {
      timeout: parseInt(process.env.SESSION_TIMEOUT || '3600000', 10),
      idleTimeout: parseInt(process.env.IDLE_TIMEOUT || '1800000', 10),
      checkInterval: parseInt(process.env.SESSION_CHECK_INTERVAL || '60000', 10),
      maxPerUser: parseInt(process.env.MAX_SESSIONS_PER_USER || '3', 10),
    };

    // Security Configuration
    this.config.security = {
      jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
      jwtExpiry: process.env.JWT_EXPIRY || '24h',
      csrfProtection: process.env.CSRF_PROTECTION === 'true',
      allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    };

    // Rate Limiting
    this.config.rateLimit = {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10),
      maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
      loginMaxAttempts: parseInt(process.env.LOGIN_RATE_LIMIT || '5', 10),
      loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW || '900000', 10),
    };

    // RDPWrap Configuration
    this.config.rdpwrap = {
      enabled: process.env.RDPWRAP_ENABLED === 'true',
      maxSessions: parseInt(process.env.RDPWRAP_MAX_SESSIONS || '10', 10),
      validationInterval: parseInt(process.env.RDPWRAP_VALIDATION_INTERVAL || '300000', 10),
    };

    // Logging Configuration
    this.config.logging = {
      level: process.env.LOG_LEVEL || 'info',
      file: process.env.LOG_FILE || './logs/app.log',
      auditFile: process.env.AUDIT_LOG_FILE || './logs/audit.log',
    };

    // WebSocket Configuration
    this.config.websocket = {
      pingInterval: parseInt(process.env.WS_PING_INTERVAL || '30000', 10),
      pingTimeout: parseInt(process.env.WS_PING_TIMEOUT || '5000', 10),
      maxPayloadSize: parseInt(process.env.WS_MAX_PAYLOAD_SIZE || '10485760', 10),
    };

    // Optional Features
    this.config.features = {
      sessionRecording: process.env.ENABLE_SESSION_RECORDING === 'true',
      mfa: process.env.ENABLE_MFA === 'true',
      twoFa: process.env.ENABLE_2FA === 'true',
      gatewayMode: process.env.ENABLE_GATEWAY_MODE === 'true',
    };
  }

  validateConfiguration() {
    const errors = [];

    // Validate Server Configuration
    if (this.config.server.https) {
      if (!fs.existsSync(this.config.server.ssl.keyPath)) {
        errors.push(`SSL key file not found: ${this.config.server.ssl.keyPath}`);
      }
      if (!fs.existsSync(this.config.server.ssl.certPath)) {
        errors.push(`SSL cert file not found: ${this.config.server.ssl.certPath}`);
      }
    }

    // Validate Database Configuration
    if (this.config.database.type === 'sqlite') {
      const dbDir = path.dirname(this.config.database.path);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
    }

    // Validate RDP Configuration
    if (this.config.rdp.frameRate < 1 || this.config.rdp.frameRate > 60) {
      errors.push('RDP_FRAME_RATE must be between 1 and 60');
    }
    if (this.config.rdp.quality < 10 || this.config.rdp.quality > 100) {
      errors.push('RDP_QUALITY must be between 10 and 100');
    }

    // Validate JWT Secret
    if (this.config.security.jwtSecret === 'change-me-in-production' && this.config.server.nodeEnv === 'production') {
      errors.push('JWT_SECRET must be changed in production environment');
    }

    // Create logs directory
    const logsDir = path.dirname(this.config.logging.file);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    if (errors.length > 0) {
      if (this.config.server.nodeEnv === 'production') {
        throw new Error(`Configuration validation errors:\n${errors.join('\n')}`);
      } else {
        console.warn('Configuration warnings:', errors);
      }
    }
  }

  /**
   * Get a configuration value by dot notation path
   * @param {string} path - Configuration path (e.g., 'server.port')
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let value = this.config;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  }

  /**
   * Set a configuration value
   * @param {string} path - Configuration path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    let obj = this.config;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in obj) || typeof obj[key] !== 'object') {
        obj[key] = {};
      }
      obj = obj[key];
    }

    obj[keys[keys.length - 1]] = value;
  }

  /**
   * Get entire configuration object
   * @returns {object} Full configuration
   */
  getAll() {
    return this.config;
  }

  /**
   * Check if running in production
   * @returns {boolean}
   */
  isProduction() {
    return this.config.server.nodeEnv === 'production';
  }

  /**
   * Check if running in development
   * @returns {boolean}
   */
  isDevelopment() {
    return this.config.server.nodeEnv === 'development';
  }
}

// Export singleton instance
export default new ConfigManager();
