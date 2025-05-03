import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

// Load environment variables
dotenv.config();

// Create Fastify instance
const server: FastifyInstance = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Database client
const prisma = new PrismaClient();
server.decorate('prisma', prisma);

// Register plugins
server.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});

server.register(jwt, {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
});

// Register routes
import contentRoutes from './routes/content.routes';
import { teamRoutes } from './routes/team.routes';
import { organizationRoutes } from './routes/organization.routes';
import { commentRoutes } from './routes/comment.routes';

server.register(authRoutes, { prefix: '/api' });
server.register(contentRoutes, { prefix: '/api' });
server.register(teamRoutes, { prefix: '/api/teams' });
server.register(organizationRoutes, { prefix: '/api/organizations' });
server.register(commentRoutes, { prefix: '/api' });

// Health check endpoint
server.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Error handling
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  
  if (error.validation) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation error',
      errors: error.validation,
    });
  }

  // Handle JWT errors
  if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER') {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'No token provided',
    });
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_EXPIRED') {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token expired',
    });
  }

  if (error.code === 'FST_JWT_AUTHORIZATION_TOKEN_INVALID') {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  }

  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

// Graceful shutdown
const start = async () => {
  try {
    await server.ready();
    
    const port = Number(process.env.PORT) || 3001;
    const host = '0.0.0.0';
    
    await server.listen({ port, host });
    
    console.log(`Server is running on http://${host}:${port}`);
    
    // Handle shutdown
    const signals = ['SIGINT', 'SIGTERM'] as const;
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, shutting down...`);
        await server.close();
        await prisma.$disconnect();
        process.exit(0);
      });
    });
    
  } catch (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  }
};

start();

export { prisma };
