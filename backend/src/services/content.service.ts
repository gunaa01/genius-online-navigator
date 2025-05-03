import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type ContentStatus = 'draft' | 'published' | 'archived';
type ContentType = 'article' | 'video' | 'document' | 'image' | 'other';

interface CreateContentInput {
  title: string;
  body: string;
  status?: ContentStatus;
  type?: ContentType;
  metadata?: Record<string, any>;
  userId: string;
  organizationId?: string;
  teamId?: string;
}

interface UpdateContentInput {
  title?: string;
  body?: string;
  status?: ContentStatus;
  metadata?: Record<string, any>;
}

interface ContentFilters {
  status?: ContentStatus;
  type?: ContentType;
  organizationId?: string;
  teamId?: string;
  search?: string;
  userId?: string;
}

export const contentService = {
  async createContent(data: CreateContentInput) {
    return prisma.content.create({
      data: {
        title: data.title,
        body: data.body,
        status: data.status || 'draft',
        type: data.type || 'article',
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
        userId: data.userId,
        organizationId: data.organizationId,
        teamId: data.teamId,
      },
    });
  },

  async getContentById(id: string, userId: string) {
    return prisma.content.findFirst({
      where: {
        id,
        OR: [
          { userId },
          { organizationId: { not: null }, organization: { members: { some: { userId } } } },
          { teamId: { not: null }, team: { members: { some: { userId } } } },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  async updateContent(id: string, data: UpdateContentInput, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!content) {
      throw new Error('Content not found or access denied');
    }

    return prisma.content.update({
      where: { id },
      data: {
        ...data,
        metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
        ...(data.status === 'published' && !content.publishedAt
          ? { publishedAt: new Date() }
          : {}),
      },
    });
  },

  async deleteContent(id: string, userId: string) {
    const content = await prisma.content.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!content) {
      throw new Error('Content not found or access denied');
    }

    return prisma.content.delete({
      where: { id },
    });
  },

  async listContent(filters: ContentFilters, page = 1, limit = 10) {
    const where: any = {
      OR: [
        { userId: filters.userId },
        { status: 'published' },
        {
          organizationId: { not: null },
          organization: { members: { some: { userId: filters.userId || '' } } },
        },
        {
          teamId: { not: null },
          team: { members: { some: { userId: filters.userId || '' } } },
        },
      ],
    };

    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.organizationId) where.organizationId = filters.organizationId;
    if (filters.teamId) where.teamId = filters.teamId;

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { body: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      }),
      prisma.content.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  },

  async getContentTypes() {
    const types = await prisma.content.groupBy({
      by: ['type'],
      _count: {
        type: true,
      },
    });

    return types.map((t) => ({
      type: t.type,
      count: t._count.type,
    }));
  },

  async getContentStats(userId: string) {
    const [total, published, drafts, byType] = await Promise.all([
      prisma.content.count({
        where: {
          OR: [
            { userId },
            { organization: { members: { some: { userId } } } },
            { team: { members: { some: { userId } } } },
          ],
        },
      }),
      prisma.content.count({
        where: {
          status: 'published',
          OR: [
            { userId },
            { organization: { members: { some: { userId } } } },
            { team: { members: { some: { userId } } } },
          ],
        },
      }),
      prisma.content.count({
        where: {
          status: 'draft',
          OR: [
            { userId },
            { organization: { members: { some: { userId } } } },
            { team: { members: { some: { userId } } } },
          ],
        },
      }),
      prisma.content.groupBy({
        by: ['type'],
        where: {
          OR: [
            { userId },
            { organization: { members: { some: { userId } } } },
            { team: { members: { some: { userId } } } },
          ],
        },
        _count: {
          type: true,
        },
      }),
    ]);

    return {
      total,
      published,
      drafts,
      byType: byType.map((t) => ({
        type: t.type,
        count: t._count.type,
      })),
    };
  },
};

export type { ContentStatus, ContentType };
