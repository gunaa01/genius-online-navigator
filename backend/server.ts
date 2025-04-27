import Fastify from 'fastify';
import { contentGenRoutes } from './routes/content_generation';
import { seoRoutes } from './routes/seo';
import { notificationRoutes } from './routes/notifications';
import fastifyJwt from '@fastify/jwt';

const server = Fastify();

server.register(fastifyJwt, { secret: process.env.JWT_SECRET! });
server.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch {
    reply.status(401).send({ message: 'Unauthorized' });
  }
});

await server.register(contentGenRoutes);
await server.register(seoRoutes);
await server.register(notificationRoutes);

server.listen({ port: 3001 }, (err, address) => {
  if (err) throw err;
  console.log(`Server running at ${address}`);
});

export default server;
