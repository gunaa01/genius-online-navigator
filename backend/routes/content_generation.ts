import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function contentGenRoutes(server: FastifyInstance) {
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
    const userId = req.user.id;
    return prisma.generatedContent.findMany({ where: { userId } });
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
    const userId = req.user.id;
    const { title, body, status } = req.body as { title: string; body: string; status: string };
    const created = await prisma.generatedContent.create({
      data: { userId, title, body, status },
    });
    reply.status(201).send(created);
  });
}
