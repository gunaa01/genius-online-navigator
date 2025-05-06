import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';

export function createTestContentRoutes(server: FastifyInstance) {
  server.get('/api/content', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          title: Type.String(),
          body: Type.String(),
          status: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
        })),
      },
      security: [{ bearerAuth: [] }],
      tags: ['ContentGeneration'],
    },
    preValidation: [server.authenticate],
  }, async (req, reply) => {
    return [];
  });

  server.post('/api/content', {
    schema: {
      body: Type.Object({
        title: Type.String(),
        body: Type.String(),
        status: Type.String(),
      }),
      response: {
        201: Type.Object({
          id: Type.String(),
          title: Type.String(),
          body: Type.String(),
          status: Type.String(),
          createdAt: Type.String(),
          updatedAt: Type.String(),
        }),
      },
      security: [{ bearerAuth: [] }],
      tags: ['ContentGeneration'],
    },
    preValidation: [server.authenticate],
  }, async (req, reply) => {
    const { title, body, status } = req.body as any;
    
    return {
      id: 'test-id',
      title,
      body,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}
