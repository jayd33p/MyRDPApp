import helmet from 'helmet';
import configManager from '../config/configManager.js';

/**
 * Security middleware configuration
 */
export function setupSecurityMiddleware(app) {
  // Helmet.js for setting HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'", 'wss:', 'https:'],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      frameguard: {
        action: 'deny',
      },
      xssFilter: true,
      noSniff: true,
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })
  );

  // Disable powered by header
  app.disable('x-powered-by');
}

/**
 * CORS middleware
 */
export function setupCorsMiddleware(app) {
  const allowedOrigins = configManager.get('security.allowedOrigins', []);

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-Token');
      res.header('Access-Control-Max-Age', '86400');
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });
}
