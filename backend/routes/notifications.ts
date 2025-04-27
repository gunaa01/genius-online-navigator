import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function notificationRoutes(server: FastifyInstance) {
  server.get('/api/notifications', {
    schema: {
      response: {
        200: Type.Array(Type.Object({
          id: Type.String(),
          message: Type.String(),
          isRead: Type.Boolean(),
          createdAt: Type.String(),
        })),
      },
      security: [{ bearerAuth: [] }],
      tags: ['Notifications'],
    },
    preValidation: [server.authenticate],
  }, async (req) => {
    const userId = req.user.id;
    return prisma.notification.findMany({ 
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  });

  server.patch('/api/notifications/:id/read', {
    schema: {
      params: Type.Object({ id: Type.String() }),
      response: { 200: Type.Object({ success: Type.Boolean() }) },
      security: [{ bearerAuth: [] }],
      tags: ['Notifications'],
    },
    preValidation: [server.authenticate],
  }, async (req, reply) => {
    const { id } = req.params as { id: string };
    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
    return { success: true };
  });
}
