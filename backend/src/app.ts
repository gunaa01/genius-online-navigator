import Fastify, { FastifyInstance } from 'fastify';
import { contentGenRoutes } from '../routes/content_generation';
import { seoRoutes } from '../routes/seo';
import { notificationRoutes } from '../routes/notifications';
import fastifyJwt from '@fastify/jwt';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify();

  // Register JWT plugin
  app.register(fastifyJwt, { 
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production'
  });

  // Add authentication decorator
  app.decorate('authenticate', async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch {
      reply.status(401).send({ message: 'Unauthorized' });
    }
  });

  // Register routes
  await app.register(contentGenRoutes);
  await app.register(seoRoutes);
  await app.register(notificationRoutes);

  return app;
}

export default buildApp;
