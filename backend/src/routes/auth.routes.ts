import { FastifyInstance } from 'fastify';
import { signup, login } from '../controllers/auth.controller';
import { verifyToken, createTokens } from '../utils/auth';

export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/auth/signup', signup);
  fastify.post('/auth/login', login);

  // Protected routes
  fastify.get('/auth/me', { preValidation: [verifyToken] }, async (request, reply) => {
    return request.user;
  });

  // Refresh token
  fastify.post('/auth/refresh', async (request, reply) => {
    try {
      const refreshToken = request.headers['x-refresh-token'] as string;
      if (!refreshToken) {
        return reply.status(401).send({ error: 'Refresh token required' });
      }

      const decoded = await request.jwt.verify(refreshToken);
      const tokens = createTokens(request.server, { 
        id: (decoded as any).id, 
        email: (decoded as any).email 
      });
      
      return tokens;
    } catch (error) {
      reply.status(401).send({ error: 'Invalid refresh token' });
    }
  });
}
