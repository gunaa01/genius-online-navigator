import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import helmet from 'fastify-helmet';
import { envVars } from '../config/env';

/**
 * Security headers configuration
 * 
 * This middleware adds important security headers to protect against common web vulnerabilities:
 * - Content-Security-Policy: Prevents XSS attacks by controlling resources the browser is allowed to load
 * - X-XSS-Protection: Enables browser's built-in XSS filtering
 * - X-Content-Type-Options: Prevents MIME-sniffing
 * - X-Frame-Options: Prevents clickjacking
 * - Referrer-Policy: Controls how much referrer information is included with requests
 * - Strict-Transport-Security: Forces HTTPS
 * 
 * @see https://helmetjs.github.io/
 * @see https://owasp.org/www-project-secure-headers/
 */
export const setupSecurityHeaders = (app: FastifyInstance) => {
  // Apply helmet with customized CSP
  app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'https://api.example.com'],
      },
    },
    // Enable HSTS only in production
    hsts: envVars.NODE_ENV === 'production' ? {
      maxAge: 15552000, // 180 days
      includeSubDomains: true,
      preload: true
    } : false,
    // Prevent browsers from detecting the MIME type
    noSniff: true,
    // Prevent clickjacking
    frameguard: {
      action: 'deny'
    },
    // Set referrer policy
    referrerPolicy: {
      policy: 'same-origin'
    }
  });

  // Add custom security headers
  app.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done) => {
    // Add feature policy header
    reply.header(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), interest-cohort=()'
    );
    
    // Add CSRF protection header for API endpoints
    if (request.url.startsWith('/api/')) {
      reply.header('X-Content-Type-Options', 'nosniff');
    }
    
    done();
  });
};

/**
 * CSRF protection middleware
 * 
 * This middleware adds CSRF protection to mutation endpoints (POST, PUT, DELETE, PATCH)
 * It validates the CSRF token from the request header against the token stored in the session
 * 
 * @param {FastifyRequest} request - Fastify request object
 * @param {FastifyReply} reply - Fastify reply object
 * @param {Function} done - Callback function
 */
export const csrfProtection = (request: FastifyRequest, reply: FastifyReply, done: (err?: Error) => void) => {
  const isMutationRequest = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  
  // Skip CSRF check for non-mutation requests or API endpoints that use JWT authentication
  if (!isMutationRequest || request.url.startsWith('/api/auth/')) {
    return done();
  }
  
  const csrfToken = request.headers['x-csrf-token'];
  const storedToken = (request as any).session?.csrfToken;
  
  if (!csrfToken || !storedToken || csrfToken !== storedToken) {
    return reply.code(403).send({
      error: 'Invalid or missing CSRF token',
      message: 'CSRF protection triggered. Please include a valid CSRF token in your request.'
    });
  }
  
  done();
};
