import Fastify, { FastifyInstance } from 'fastify';
import { createTestContentRoutes } from './test-routes/content';
import fastifyJwt from '@fastify/jwt';

export async function buildTestApp(): Promise<FastifyInstance> {
  const app = Fastify();

  // Register JWT plugin
  app.register(fastifyJwt, { 
    secret: process.env.JWT_SECRET || 'test_jwt_secret_key'
  });

  // Add authentication decorator
  app.decorate('authenticate', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  // Register test routes
  createTestContentRoutes(app);

  return app;
}

export default buildTestApp;
