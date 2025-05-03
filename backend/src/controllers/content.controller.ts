import { FastifyRequest, FastifyReply } from 'fastify';

interface AuthenticatedRequest extends FastifyRequest {
  user: {
    id: string;
    email: string;
  };
}
import { prisma } from '../server';
import { verifyToken } from '../utils/auth';

interface CreateContentBody {
  title: string;
  body: string;
  type: string;
  metadata?: Record<string, any>;
}

interface UpdateContentBody extends Partial<CreateContentBody> {
  status?: 'draft' | 'published' | 'archived';
}

export const createContent = async (
  request: AuthenticatedRequest & { body: CreateContentBody },
  reply: FastifyReply
) => {
  try {
    const { title, body, type, metadata } = request.body;
    const userId = request.user.id;

    const content = await prisma.content.create({
      data: {
        title,
        body,
        type,
        metadata,
        userId,
      },
    });

    return { 
      ...content,
      user: undefined, // Remove user data from response
    };
  } catch (error) {
    console.error('Create content error:', error);
    reply.status(500).send({ error: 'Failed to create content' });
  }
};

export const getContent = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    const content = await prisma.content.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        status: true,
        metadata: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!content) {
      return reply.status(404).send({ error: 'Content not found' });
    }

    return content;
  } catch (error) {
    console.error('Get content error:', error);
    reply.status(500).send({ error: 'Failed to fetch content' });
  }
};

export const updateContent = async (
  request: AuthenticatedRequest & { 
    params: { id: string };
    body: UpdateContentBody;
  },
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;
    const { title, body, type, status, metadata } = request.body;

    // Verify content exists and belongs to user
    const existingContent = await prisma.content.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return reply.status(404).send({ error: 'Content not found' });
    }

    if (existingContent.userId !== request.user.id) {
      return reply.status(403).send({ error: 'Not authorized' });
    }

    const updateData: any = {
      title,
      body,
      type,
      status,
      metadata,
    };

    // If status is being updated to 'published' and it wasn't published before
    if (status === 'published' && existingContent.status !== 'published') {
      updateData.publishedAt = new Date();
    }

    const content = await prisma.content.update({
      where: { id },
      data: updateData,
    });

    return { 
      ...content,
      user: undefined, // Remove user data from response
    };
  } catch (error) {
    console.error('Update content error:', error);
    reply.status(500).send({ error: 'Failed to update content' });
  }
};

export const deleteContent = async (
  request: AuthenticatedRequest & { params: { id: string } },
  reply: FastifyReply
) => {
  try {
    const { id } = request.params;

    // Verify content exists and belongs to user
    const existingContent = await prisma.content.findUnique({
      where: { id },
    });

    if (!existingContent) {
      return reply.status(404).send({ error: 'Content not found' });
    }

    if (existingContent.userId !== request.user.id) {
      return reply.status(403).send({ error: 'Not authorized' });
    }

    await prisma.content.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Delete content error:', error);
    reply.status(500).send({ error: 'Failed to delete content' });
  }
};

interface ListContentQuery {
  page?: string;
  limit?: string;
  type?: string;
  status?: string;
}

export const listContent = async (
  request: FastifyRequest<{ Querystring: ListContentQuery }>,
  reply: FastifyReply
) => {
  try {
    const { page, limit, type, status } = request.query;
    
    // Convert query parameters to numbers with defaults
    const pageNum = page ? Math.max(1, parseInt(page, 10) || 1) : 1;
    const limitNum = limit ? Math.min(100, Math.max(1, parseInt(limit, 10) || 10)) : 10;
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {};
    
    if (type) where.type = type;
    if (status) where.status = status;

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.content.count({ where }),
    ]);

    return {
      data: content,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  } catch (error) {
    console.error('List content error:', error);
    reply.status(500).send({ error: 'Failed to fetch content list' });
  }
};
