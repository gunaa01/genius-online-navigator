import { FastifyInstance } from 'fastify';
// Using require instead of import to avoid type errors until dependencies are installed
const fastifySwagger = require('@fastify/swagger');
const fastifySwaggerUi = require('@fastify/swagger-ui');
import { envVars } from '../config/env';

/**
 * Configure Swagger/OpenAPI documentation
 * 
 * This plugin sets up Swagger documentation for the API endpoints
 * It provides an interactive UI for exploring and testing the API
 * 
 * @param {FastifyInstance} app - Fastify instance
 */
export const setupSwagger = async (app: FastifyInstance) => {
  // Register Swagger plugin
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Genius Online Navigator API',
        description: 'API documentation for the Genius Online Navigator application',
        version: '1.0.0',
        contact: {
          name: 'API Support',
          email: 'support@example.com'
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT'
        }
      },
      servers: [
        {
          url: `http://localhost:${envVars.PORT}`,
          description: 'Development server'
        },
        {
          url: 'https://api.example.com',
          description: 'Production server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'users', description: 'User management endpoints' },
        { name: 'content', description: 'Content management endpoints' },
        { name: 'teams', description: 'Team management endpoints' },
        { name: 'organizations', description: 'Organization management endpoints' }
      ]
    }
  });

  // Register Swagger UI plugin
  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      displayRequestDuration: true
    },
    staticCSP: true,
    transformStaticCSP: (header: string) => header
  });

  // Add schema definitions for common types
  app.addSchema({
    $id: 'errorResponse',
    type: 'object',
    properties: {
      statusCode: { type: 'integer' },
      error: { type: 'string' },
      message: { type: 'string' }
    }
  });

  app.addSchema({
    $id: 'authTokens',
    type: 'object',
    properties: {
      accessToken: { type: 'string' },
      refreshToken: { type: 'string' },
      expiresIn: { type: 'integer' },
      tokenType: { type: 'string', enum: ['Bearer'] }
    }
  });

  app.addSchema({
    $id: 'userRole',
    type: 'string',
    enum: ['USER', 'EDITOR', 'ADMIN', 'SUPERADMIN']
  });

  // Log Swagger documentation URL
  app.log.info(`Swagger documentation available at: http://localhost:${envVars.PORT}/documentation`);
};

/**
 * Example route schema for authentication endpoints
 * These can be imported and used in route definitions
 */
export const authSchemas = {
  login: {
    tags: ['auth'],
    summary: 'User login',
    description: 'Authenticate a user and return access and refresh tokens',
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 }
      }
    },
    response: {
      200: { $ref: 'authTokens#' },
      400: { $ref: 'errorResponse#' },
      401: { $ref: 'errorResponse#' }
    }
  },
  register: {
    tags: ['auth'],
    summary: 'User registration',
    description: 'Register a new user account',
    body: {
      type: 'object',
      required: ['email', 'password', 'name'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        name: { type: 'string', minLength: 2 }
      }
    },
    response: {
      201: { $ref: 'authTokens#' },
      400: { $ref: 'errorResponse#' },
      409: { $ref: 'errorResponse#' }
    }
  },
  refresh: {
    tags: ['auth'],
    summary: 'Refresh access token',
    description: 'Get a new access token using a refresh token',
    body: {
      type: 'object',
      required: ['refreshToken'],
      properties: {
        refreshToken: { type: 'string' }
      }
    },
    response: {
      200: { $ref: 'authTokens#' },
      400: { $ref: 'errorResponse#' },
      401: { $ref: 'errorResponse#' }
    }
  },
  logout: {
    tags: ['auth'],
    summary: 'User logout',
    description: 'Invalidate the user\'s refresh token',
    security: [{ bearerAuth: [] }],
    response: {
      204: { type: 'null' },
      401: { $ref: 'errorResponse#' }
    }
  }
};
