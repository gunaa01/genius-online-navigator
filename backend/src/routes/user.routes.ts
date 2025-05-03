import { FastifyInstance } from 'fastify';
import UserController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { UserRole } from '../utils/auth';

export default async function userRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post(
    '/register',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 },
            isActive: { type: 'boolean', default: true },
            isSuperuser: { type: 'boolean', default: false }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              user: { $ref: 'UserResponse' },
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' }
            }
          },
          400: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.register
  );

  fastify.post(
    '/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              user: { $ref: 'UserResponse' },
              accessToken: { type: 'string' },
              refreshToken: { type: 'string' }
            }
          },
          401: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.login
  );

  // Protected routes
  // Protected routes
  fastify.get(
    '/me',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        response: {
          200: { $ref: 'UserResponse' },
          401: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.getProfile
  );

  // Admin routes
  fastify.get(
    '/',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number', minimum: 1, default: 1 },
            limit: { type: 'number', minimum: 1, maximum: 100, default: 10 },
            search: { type: 'string' },
            role: { type: 'string', enum: Object.values(UserRole) },
            isActive: { type: 'boolean' },
            sortBy: { type: 'string', default: 'createdAt' },
            sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'desc' }
          }
        },
        response: {
          200: { $ref: 'UsersResponse' },
          403: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.getUsers
  );

  fastify.get(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        response: {
          200: { $ref: 'UserResponse' },
          400: { $ref: 'ErrorResponse' },
          403: { $ref: 'ErrorResponse' },
          404: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.getUser
  );

  fastify.put(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string', minLength: 1 },
            lastName: { type: 'string', minLength: 1 },
            isActive: { type: 'boolean' },
            isSuperuser: { type: 'boolean' },
            role: { type: 'string', enum: Object.values(UserRole) }
          }
        },
        response: {
          200: { $ref: 'UserResponse' },
          400: { $ref: 'ErrorResponse' },
          403: { $ref: 'ErrorResponse' },
          404: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.updateUser
  );

  fastify.post(
    '/:id/change-password',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        body: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string', minLength: 6 },
            newPassword: { type: 'string', minLength: 6 }
          }
        },
        response: {
          204: { type: 'null' },
          400: { $ref: 'ErrorResponse' },
          403: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.changePassword
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [authenticate],
      schema: {
        headers: {
          type: 'object',
          properties: {
            authorization: { type: 'string' }
          },
          required: ['authorization']
        },
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        },
        response: {
          204: { type: 'null' },
          400: { $ref: 'ErrorResponse' },
          403: { $ref: 'ErrorResponse' },
          404: { $ref: 'ErrorResponse' },
          500: { $ref: 'ErrorResponse' }
        }
      }
    },
    UserController.deleteUser
  );
}
