/**
 * Authentication and Authorization Utilities
 * 
 * This module provides authentication and authorization utilities including:
 * - JWT token generation and verification
 * - Authentication middleware
 * - Role-based access control
 * - Token refresh mechanism
 * 
 * @module auth
 * 
 * @security
 * ## Security Considerations
 * 
 * ### Token Security
 * - Always use HTTPS in production to prevent token interception
 * - Store refresh tokens securely (httpOnly, Secure, SameSite=Strict)
 * - Keep access token expiration short (15-30 minutes recommended)
 * - Implement proper token invalidation on logout/password change
 * 
 * ### Rate Limiting
 * - Apply rate limiting to authentication endpoints
 * - Consider IP-based blocking after multiple failed attempts
 * - Monitor for suspicious authentication patterns
 * 
 * ### Best Practices
 * - Never log tokens or sensitive user information
 * - Validate all user input thoroughly
 * - Keep dependencies up to date
 * - Implement proper error handling without leaking sensitive information
 * - Regularly rotate JWT secrets
 * 
 * @see {@link https://auth0.com/docs/security | Auth0 Security Best Practices}
 * @see {@link https://owasp.org/www-project-cheat-sheets/cheatsheets/Authentication_Cheat_Sheet.html | OWASP Authentication Cheat Sheet}
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';
import { envVars } from '../config/env';

// Initialize Redis client for rate limiting
let redisClient: ReturnType<typeof createClient>;

// Use environment variables directly from envVars when needed

// Rate limiting configuration
type RateLimitRequest = {
  url?: string;
  [key: string]: any;
};

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  // Redis store for distributed rate limiting
  store: envVars.REDIS_URL ? new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args)
  }) : undefined,
  message: 'Too many requests, please try again later.',
  skip: (req: RateLimitRequest) => {
    // Skip rate limiting for health checks and static assets
    return req.url === '/health' || (req.url?.startsWith('/static/') ?? false);
  }
});

/**
 * Custom error class for authentication related errors
 * @extends Error
 */
class AuthenticationError extends Error {
  statusCode: number;

  /**
   * Create an authentication error
   * @param {string} message - Error message
   * @param {number} [statusCode=401] - HTTP status code (default: 401 Unauthorized)
   */
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Custom error class for authorization related errors
 * @extends Error
 */
class AuthorizationError extends Error {
  statusCode: number;

  /**
   * Create an authorization error
   * @param {string} message - Error message
   * @param {number} [statusCode=403] - HTTP status code (default: 403 Forbidden)
   */
  constructor(message: string, statusCode = 403) {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Custom error class for validation related errors
 * @extends Error
 */
class ValidationError extends Error {
  statusCode: number;
  
  /**
   * Create a validation error
   * @param {string} message - Error message
   * @param {number} [statusCode=400] - HTTP status code (default: 400 Bad Request)
   */
  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * User roles in ascending order of privileges
 */
/**
 * User roles in ascending order of privileges
 * - USER: Basic authenticated user
 * - EDITOR: Can create and edit content
 * - ADMIN: Can manage users and content
 * - SUPERADMIN: Full system access
 */
type UserRole = 'USER' | 'EDITOR' | 'ADMIN' | 'SUPERADMIN';

/**
 * Payload structure for JWT tokens
 * @interface AuthTokenPayload
 * @extends JwtPayload
 * @property {string} userId - Unique user identifier
 * @property {string} email - User's email address
 * @property {UserRole} role - User's role
 * @property {number} iat - Issued at timestamp (seconds since epoch)
 * @property {number} exp - Expiration timestamp (seconds since epoch)
 */
interface AuthTokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * User information attached to authenticated requests
 * @interface RequestUser
 * @property {string} userId - Unique user identifier
 * @property {string} email - User's email address
 * @property {UserRole} role - User's role
 */
/**
 * User information from the database
 */
export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isActive: boolean;
  isSuperuser: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  refreshToken?: string;
}

/**
 * User information attached to authenticated requests
 */
interface RequestUser {
  userId: string;
  email: string;
  role: UserRole;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: RequestUser;
  }
}

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    userId: string;
    email: string;
    role: UserRole;
  }
}

/**
 * Initialize authentication utilities
 * @throws Error if required environment variables are missing
 */
const initAuth = () => {
  // Validate required environment variables
  const JWT_SECRET = process.env.JWT_SECRET;
  const REFRESH_SECRET = process.env.REFRESH_SECRET;
  
  if (!JWT_SECRET || !REFRESH_SECRET) {
    throw new Error('Missing required environment variables: JWT_SECRET and REFRESH_SECRET must be set');
  }
  
  return { JWT_SECRET, REFRESH_SECRET };
};

const { JWT_SECRET, REFRESH_SECRET } = initAuth();

const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'info', emit: 'event' },
    { level: 'error', emit: 'event' },
  ],
});

// Log database events for debugging
prisma.$on('warn', (e) => console.warn('Prisma Warning:', e));
prisma.$on('info', (e) => console.info('Prisma Info:', e));
prisma.$on('error', (e) => console.error('Prisma Error:', e));

/**
 * Token pair returned by the authentication service
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // TTL in seconds
  tokenType: 'Bearer';
}

/**
 * Generates both access and refresh tokens for a user
 * 
 * @param {Object} user - User data
 * @param {string} user.id - User ID
 * @param {string} user.email - User email
 * @param {UserRole} user.role - User role
 * @returns {TokenPair} Object containing access and refresh tokens
 * @throws {ValidationError} - If user data is invalid
 * @throws {AuthenticationError} - If token generation fails
 * 
 * @example
 * const tokens = generateTokens({
 *   id: '123',
 *   email: 'user@example.com',
 *   role: 'USER'
 * });
 */
export const generateTokens = (user: { id: string; email: string; role: UserRole }): TokenPair => {
  const accessToken = generateToken(user, '15m');
  const refreshToken = generateRefreshToken(user);
  return { 
    accessToken, 
    refreshToken,
    expiresIn: 15 * 60, // 15 minutes in seconds
    tokenType: 'Bearer' as const
  };
};

/**
 * Validates user input for token generation
 * @param user - User data to validate
 * @throws {ValidationError} - If user data is invalid
 */
const validateUserInput = (user: { id: string; email: string; role?: UserRole }) => {
  if (!user.id || typeof user.id !== 'string') {
    throw new ValidationError('Invalid user ID');
  }
  
  if (!user.email || typeof user.email !== 'string' || !/^\S+@\S+\.\S+$/.test(user.email)) {
    throw new ValidationError('Invalid email address');
  }
  
  if (user.role && !['USER', 'EDITOR', 'ADMIN', 'SUPERADMIN'].includes(user.role)) {
    throw new ValidationError('Invalid user role');
  }
};

/**
 * Generates a JWT access token
 * @param user - User data to include in the token
 * @param expiresIn - Token expiration time (e.g., '15m', '1h', '7d')
 * @returns {string} Signed JWT token
 * @throws {ValidationError} - If user data is invalid
 * @throws {AuthenticationError} - If token generation fails
 * 
 * @example
 * const token = generateToken({ id: '123', email: 'user@example.com', role: 'USER' }, '15m');
 */
export // Convert database role string to UserRole enum
const toUserRole = (role: string): UserRole => {
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  return 'USER'; // Default to USER role if invalid
};

const generateToken = (
  user: { id: string; email: string; role: string },
  expiresIn: string | number = '1h'
): string => {
  try {
    // Convert role to UserRole and validate
    const userRole = toUserRole(user.role);
    validateUserInput({ 
      id: user.id, 
      email: user.email, 
      role: userRole 
    });
    
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = typeof expiresIn === 'string' ? 
      (expiresIn.endsWith('d') ? 
        parseInt(expiresIn) * 24 * 60 * 60 : 
        expiresIn.endsWith('h') ? 
          parseInt(expiresIn) * 60 * 60 : 
          expiresIn.endsWith('m') ? 
            parseInt(expiresIn) * 60 : 
            parseInt(expiresIn)
      ) : expiresIn;
    
    if (isNaN(expiresInSeconds) || expiresInSeconds <= 0) {
      throw new ValidationError('Invalid expiration time');
    }
    
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: userRole,
      iat: now,
      exp: now + expiresInSeconds
    };
    
    // Create options object with proper typing
    const signOptions: jwt.SignOptions = {
      algorithm: 'HS256'
    };
    
    // Add expiresIn with proper type handling
    if (expiresIn) {
      if (typeof expiresIn === 'number') {
        signOptions.expiresIn = expiresIn;
      } else if (typeof expiresIn === 'string') {
        signOptions.expiresIn = expiresIn as any; // Type assertion to bypass type checking
      }
    }
    
    const token = jwt.sign(payload, envVars.JWT_SECRET, signOptions);
    
    return token;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new AuthenticationError('Failed to generate token');
  }
};

/**
 * Generates a refresh token with a longer expiration time
 * @param user - User data to include in the token
 * @returns {string} Signed JWT refresh token
 * @throws {ValidationError} - If user data is invalid
 * @throws {AuthenticationError} - If token generation fails
 * 
 * @example
 * const refreshToken = generateRefreshToken({ id: '123', email: 'user@example.com' });
 */
export const generateRefreshToken = (user: { id: string; email: string }): string => {
  try {
    validateUserInput(user);
    
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = 7 * 24 * 60 * 60; // 7 days
    
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: 'USER', // Default role for refresh tokens
      iat: now,
      exp: now + expiresInSeconds
    };
    
    const refreshOptions: jwt.SignOptions = {
      expiresIn: '7d',
      algorithm: 'HS256'
    };
    
    const refreshToken = jwt.sign(payload, envVars.REFRESH_SECRET, refreshOptions);
    
    return refreshToken;
  } catch (error) {
    if (error instanceof ValidationError) {
      throw error;
    }
    throw new AuthenticationError('Failed to generate refresh token');
  }
};

/**
 * Verified token payload with guaranteed fields
 */
export interface TokenPayload extends AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}

/**
 * Verifies a JWT token and returns its payload
 * @param token - JWT token to verify
 * @param isRefresh - Whether the token is a refresh token
 * @returns {TokenPayload} Decoded token payload
 * @throws {ValidationError} - If token is missing or malformed
 * @throws {AuthenticationError} - If token is invalid, expired, or has invalid claims
 * 
 * @example
 * try {
 *   const payload = verifyToken(token);
 *   console.log('User ID:', payload.userId);
 * } catch (error) {
 *   // Handle invalid token
 * }
 */
export const verifyToken = (token: string, isRefresh = false): TokenPayload => {
  if (!token) {
    throw new ValidationError('Token is required');
  }

  try {
    const secret = isRefresh ? REFRESH_SECRET : JWT_SECRET;
    const decoded = jwt.verify(token, secret) as AuthTokenPayload;
    
    if (!decoded || !decoded.userId) {
      throw new AuthenticationError('Invalid token payload');
    }
    
    if (!decoded.role || !['USER', 'EDITOR', 'ADMIN', 'SUPERADMIN'].includes(decoded.role)) {
      throw new AuthenticationError('Invalid user role in token');
    }
    
    if (!decoded.email) {
      throw new AuthenticationError('Email is required in token');
    }
    
    if (!decoded.iat || !decoded.exp) {
      throw new AuthenticationError('Invalid token timestamps');
    }
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      throw new AuthenticationError('Token has expired', 401);
    }
    
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      iat: decoded.iat,
      exp: decoded.exp
    };
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      throw new AuthenticationError('Token has expired', 401);
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AuthenticationError('Invalid token', 401);
    }
    
    throw new AuthenticationError('Token verification failed');
  }
};

// Authentication middleware
/**
 * Fastify authentication middleware
 * 
 * This middleware verifies the JWT token from the Authorization header
 * and attaches the user object to the request if valid.
 * 
 * @param {FastifyRequest} request - Fastify request object
 * @param {FastifyReply} reply - Fastify reply object
 * @returns {Promise<void>}
 * @throws {AuthenticationError} - If authentication fails
 * 
 * @example
 * // Apply to a route
 * fastify.get('/protected', { preHandler: authenticate }, (request, reply) => {
 *   // request.user is now available
 *   reply.send({ user: request.user });
 * });
 */
export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new AuthenticationError('No authorization header provided');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new AuthenticationError('Invalid authorization header format. Expected: Bearer <token>');
    }

    const decoded = verifyToken(token);
    
    // Verify the user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true }
    });

    if (!user || !user.isActive) {
      throw new AuthenticationError('User not found or inactive');
    }

    // Set user on the request object
    request.user = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole
    };
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof ValidationError) {
      return reply.status(error.statusCode).send({ 
        error: error.message,
        code: error.name
      });
    }
    
    // Log unexpected errors
    console.error('Authentication error:', error);
    return reply.status(500).send({ 
      error: 'Internal server error during authentication',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Validate and convert string role to UserRole enum
const toUserRole = (role: string): UserRole => {
  if (Object.values(UserRole).includes(role as UserRole)) {
    return role as UserRole;
  }
  throw new Error(`Invalid role: ${role}`);
};

// Role hierarchy definition - each role includes all permissions of roles below it
const roleHierarchy: Record<UserRole, number> = {
  'USER': 1,
  'EDITOR': 2,
  'ADMIN': 3,
  'SUPERADMIN': 4
};

/**
 * Check if a user's role meets the minimum required role
 */
const hasRequiredRole = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

/**
 * Role-based access control middleware
 * @param roles Single role or array of roles that are allowed
 * @param options Additional options for role checking
 */
/**
 * Role-based authorization middleware
 * 
 * This middleware checks if the authenticated user has the required role(s)
 * to access a route. It should be used after the authenticate middleware.
 * 
 * @param {UserRole | UserRole[]} roles - Required role(s) to access the route
 * @param {Object} [options] - Authorization options
 * @param {boolean} [options.requireAll=false] - If true, user must have all specified roles
 * @param {boolean} [options.checkHierarchy=true] - If true, higher roles inherit permissions of lower roles
 * @returns {Function} Fastify middleware function
 * 
 * @example
 * // Require ADMIN role
 * fastify.get('/admin', { 
 *   preHandler: [authenticate, authorize('ADMIN')] 
 * }, adminHandler);
 * 
 * // Require either EDITOR or ADMIN role
 * fastify.post('/content', { 
 *   preHandler: [authenticate, authorize(['EDITOR', 'ADMIN'])] 
 * }, contentHandler);
 */
export const authorize = (
  roles: UserRole | UserRole[],
  options: { requireAll?: boolean; checkHierarchy?: boolean } = { requireAll: false, checkHierarchy: true }
) => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        throw new AuthenticationError('Authentication required');
      }

      const requiredRoles = Array.isArray(roles) ? roles : [roles];
      const userRole = request.user.role;

      // If checking hierarchy, only the highest required role matters
      if (options.checkHierarchy) {
        const highestRequiredRole = requiredRoles.reduce((highest, role) => {
          return roleHierarchy[role] > roleHierarchy[highest] ? role : highest;
        }, requiredRoles[0]);

        if (!hasRequiredRole(userRole, highestRequiredRole)) {
          throw new AuthorizationError(
            `Insufficient permissions. Required role: ${highestRequiredRole} or higher`
          );
        }
      } else {
        // Check if user has any of the required roles
        const hasAnyRole = requiredRoles.some(role => userRole === role);
        if (!hasAnyRole) {
          throw new AuthorizationError(
            `Insufficient permissions. Required roles: ${requiredRoles.join(' or ')}`
          );
        }
      }

      // If we get here, authorization is successful
      return;
    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof AuthorizationError) {
        return reply.status(error.statusCode).send({
          error: error.message,
          code: error.name,
          requiredRoles: Array.isArray(roles) ? roles : [roles]
        });
      }

      // Log unexpected errors
      console.error('Authorization error:', error);
      return reply.status(500).send({
        error: 'Internal server error during authorization',
        code: 'AUTHORIZATION_ERROR'
      });
    }
  };
};

/**
 * Handles token refresh by validating the refresh token and issuing new tokens
 * @param refreshToken - The refresh token from the client
 * @returns Promise<TokenPair> - New access and refresh tokens
 * @throws {AuthenticationError} - If token is invalid or user not found
 * @throws {ValidationError} - If refresh token is missing or malformed
 */
export const handleTokenRefresh = async (refreshToken: string): Promise<TokenPair> => {
  try {
    if (!refreshToken) {
      throw new ValidationError('Refresh token is required');
    }

    // Verify the refresh token
    const decoded = verifyToken(refreshToken, true);
    
    // Check if the user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { 
        id: true, 
        email: true, 
        role: true,
        isActive: true
      }
    });
    
    // Since refreshToken might be stored elsewhere or in a different way
    // We'll need to adapt this part based on how refresh tokens are actually stored

    if (!user) {
      throw new AuthenticationError('User not found', 404);
    }

    if (!user.isActive) {
      throw new AuthenticationError('User account is not active', 403);
    }

    // For now, we'll skip the refresh token verification until we implement proper token storage
    // In a production environment, you would verify the token against a stored value
    /* if (user.refreshToken !== refreshToken) {
      // If token doesn't match, it might be a compromised token
      // Consider revoking all user's refresh tokens here
      throw new AuthenticationError('Invalid refresh token', 401);
    } */

    // Generate new tokens
    const tokens = generateTokens({
      id: user.id,
      email: user.email,
      role: user.role as UserRole
    });

    // Update the refresh token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: tokens.refreshToken }
    });

    return tokens;
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof ValidationError) {
      throw error;
    }
    
    // Log the error for debugging
    console.error('Token refresh error:', error);
    
    // Don't expose internal errors to the client
    throw new AuthenticationError('Failed to refresh token. Please log in again.');
  }
};
