import { FastifyInstance } from 'fastify';
import { Type } from '@sinclair/typebox';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seoRoutes(server: FastifyInstance) {
  server.get('/api/seo/meta-tags', {
    schema: {
      querystring: Type.Object({ path: Type.String() }),
      response: {
        200: Type.Object({
          title: Type.String(),
          description: Type.String(),
          keywords: Type.String(),
        }),
      },
      security: [{ bearerAuth: [] }],
      tags: ['SEO'],
    },
    preValidation: [server.authenticate],
  }, async (req, reply) => {
    const { path } = req.query as { path: string };
    const meta = await prisma.metaTag.findUnique({ where: { path } });
    if (!meta) return reply.status(404).send();
    return {
      title: meta.title,
      description: meta.description,
      keywords: meta.keywords,
    };
  });
}
