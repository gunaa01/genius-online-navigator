import { FastifyInstance, FastifyRequest } from 'fastify';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { env } from '../config/env';

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  skip?: (req: FastifyRequest) => boolean;
}

/**
 * Default rate limiting configuration for authentication endpoints
 */
const defaultAuthConfig: RateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => {
    // Skip rate limiting for health checks and static assets
    return req.url === '/health' || (req.url?.startsWith('/static/') ?? false);
  }
};

/**
 * Sensitive endpoints rate limiting (login, password reset, etc.)
 */
const sensitiveEndpointsConfig: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: 'Too many attempts, please try again later.'
};

/**
 * Public API endpoints rate limiting
 */
const publicApiConfig: RateLimitConfig = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Limit each IP to 1000 requests per hour
  message: 'Too many requests, please try again later.'
};

/**
 * Initialize Redis store for distributed rate limiting
 */
const initRedisStore = () => {
  if (!env.REDIS_URL) return undefined;

  const redisClient = createClient({
    url: env.REDIS_URL
  });

  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });

  return new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args)
  });
};

/**
 * Creates a rate limiter instance with the given configuration
 */
const createRateLimiter = (config: RateLimitConfig) => {
  const store = initRedisStore();
  
  return rateLimit({
    ...config,
    store,
    standardHeaders: true,
    legacyHeaders: false,
    skip: config.skip
  });
};

/**
 * Applies rate limiting to the Fastify instance
 */
export const setupRateLimiting = (app: FastifyInstance) => {
  const authLimiter = createRateLimiter(defaultAuthConfig);
  const sensitiveLimiter = createRateLimiter(sensitiveEndpointsConfig);
  const apiLimiter = createRateLimiter(publicApiConfig);

  // Apply rate limiting to authentication endpoints
  app.addHook('onRequest', (request, reply, done) => {
    if (request.url.startsWith('/api/auth/')) {
      // Apply stricter limits to sensitive auth endpoints
      if (['/api/auth/login', '/api/auth/register', '/api/auth/forgot-password'].some(path => 
        request.url.startsWith(path)
      )) {
        return sensitiveLimiter(request.raw, reply.raw, done);
      }
      return authLimiter(request.raw, reply.raw, done);
    }
    
    // Apply general API rate limiting
    if (request.url.startsWith('/api/')) {
      return apiLimiter(request.raw, reply.raw, done);
    }
    
    done();
  });
};

/**
 * Rate limiter for specific routes
 */
export const rateLimiter = (config: Partial<RateLimitConfig> = {}) => {
  return createRateLimiter({
    ...defaultAuthConfig,
    ...config
  });
};
